import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma, prisma } from "@medic/database";
import { categoryUpdateSchema } from "@medic/core";
import { handleRoute, parseBody, ApiError } from "@/lib/api";
import { requireRole } from "@/lib/rbac";

export function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const { id } = await params;
    const input = await parseBody(req, categoryUpdateSchema);
    try {
      const category = await prisma.category.update({
        where: { id },
        data: { ...(input.nameAr !== undefined && { nameAr: input.nameAr }) },
      });
      revalidateTag("categories");
      return NextResponse.json(category);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") throw new ApiError(409, "DUPLICATE_CATEGORY", "اسم الفئة موجود مسبقًا");
        if (e.code === "P2025") throw new ApiError(404, "CATEGORY_NOT_FOUND", "الفئة غير موجودة");
      }
      throw e;
    }
  });
}

export function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const { id } = await params;

    // منع حذف فئة مرتبطة بمنتجات (تحقّق على الخادم بالإضافة لقيد المفتاح الأجنبي)
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw new ApiError(
        409,
        "CATEGORY_HAS_PRODUCTS",
        `لا يمكن حذف الفئة لأنها مرتبطة بـ ${productCount} منتج. انقل هذه المنتجات إلى فئة أخرى أو احذفها أولًا.`,
      );
    }

    try {
      await prisma.category.delete({ where: { id } });
      revalidateTag("categories");
      return NextResponse.json({ ok: true });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        throw new ApiError(404, "CATEGORY_NOT_FOUND", "الفئة غير موجودة");
      }
      throw e;
    }
  });
}
