import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { productUpdateSchema } from "@medic/core";
import { handleRoute, parseBody, ApiError } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { serializeProduct } from "@/lib/services/products";

export function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const user = await requireRole("ADMIN", "CASHIER");
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
    if (!product) throw new ApiError(404, "PRODUCT_NOT_FOUND", "المنتج غير موجود");
    return NextResponse.json({
      ...serializeProduct(product, user.role !== "ADMIN"),
      category: product.category,
    });
  });
}

export function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const { id } = await params;
    const input = await parseBody(req, productUpdateSchema);
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(input.nameAr !== undefined && { nameAr: input.nameAr }),
        ...(input.sku !== undefined && { sku: input.sku }),
        ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
        ...(input.costPrice !== undefined && { costPrice: input.costPrice }),
        ...(input.salePrice !== undefined && { salePrice: input.salePrice }),
        ...(input.compareAtPrice !== undefined && { compareAtPrice: input.compareAtPrice }),
        ...(input.deliveryPrice !== undefined && { deliveryPrice: input.deliveryPrice }),
        ...(input.quantity !== undefined && { quantity: input.quantity }),
        ...(input.minQuantity !== undefined && { minQuantity: input.minQuantity }),
        ...(input.images !== undefined && { images: input.images }),
        ...(input.videoUrl !== undefined && { videoUrl: input.videoUrl }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.isOnline !== undefined && { isOnline: input.isOnline }),
        ...(input.customFields !== undefined && { customFields: input.customFields }),
      },
    });
    return NextResponse.json(serializeProduct(product));
  });
}

export function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const { id } = await params;

    // المنتج محذوف مسبقًا (مثلًا من جهاز آخر) ⇒ 404 نظيف بدل خطأ Prisma 500.
    const existing = await prisma.product.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new ApiError(404, "PRODUCT_NOT_FOUND", "المنتج غير موجود");

    // المنتج المرتبط بمبيعات/طلبات جزء من السجل المالي ⇒ يُمنع حذفه (يحافظ على الفواتير والتقارير).
    const [saleCount, orderCount] = await Promise.all([
      prisma.saleItem.count({ where: { productId: id } }),
      prisma.orderItem.count({ where: { productId: id } }),
    ]);
    if (saleCount > 0 || orderCount > 0) {
      throw new ApiError(409, "PRODUCT_IN_USE", "لا يمكن حذف منتج له مبيعات أو طلبات مرتبطة");
    }

    // وإلا: نظّف سجلّات التتبّع (الدفعات + حركات المخزون) ثم احذف المنتج ذرّيًّا.
    await prisma.$transaction([
      prisma.productBatch.deleteMany({ where: { productId: id } }),
      prisma.stockMovement.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);
    return NextResponse.json({ ok: true });
  });
}
