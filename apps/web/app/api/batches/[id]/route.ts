import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { productBatchUpdateSchema } from "@medic/core";
import { handleRoute, parseBody, ApiError } from "@/lib/api";
import { requireRole } from "@/lib/rbac";

/** تعديل دفعة (تصحيح): سعر الشراء / الصلاحية / السبب. لا تُمسّ الكمية أو المتبقّي. */
export function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const { id } = await params;
    const input = await parseBody(req, productBatchUpdateSchema);

    const existing = await prisma.productBatch.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "BATCH_NOT_FOUND", "الدفعة غير موجودة");

    const batch = await prisma.productBatch.update({
      where: { id },
      data: {
        ...(input.costPrice !== undefined && { costPrice: input.costPrice }),
        ...(input.expiryDate !== undefined && {
          expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
        }),
        ...(input.reason !== undefined && { reason: input.reason }),
      },
    });
    return NextResponse.json({ ok: true, id: batch.id });
  });
}

/**
 * حذف دفعة. مسموح فقط للدفعة غير المستهلَكة (remaining === quantity) — أي إدخال خاطئ.
 * يُنقص مخزون المنتج بمقدار الدفعة ويسجّل حركة تسوية، داخل معاملة.
 * الدفعة المستهلَكة جزئيًا تُرفض (لها COGS مسجّل في فواتير).
 */
export function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const { id } = await params;

    const batch = await prisma.productBatch.findUnique({ where: { id } });
    if (!batch) throw new ApiError(404, "BATCH_NOT_FOUND", "الدفعة غير موجودة");
    if (batch.remaining !== batch.quantity) {
      throw new ApiError(
        409,
        "BATCH_CONSUMED",
        "لا يمكن حذف دفعة استُهلكت منها كمية (مرتبطة بمبيعات). تصحيحها فقط متاح.",
      );
    }

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: batch.productId } });
      const nextQty = Math.max(0, (product?.quantity ?? 0) - batch.remaining);
      await tx.product.update({ where: { id: batch.productId }, data: { quantity: nextQty } });
      await tx.stockMovement.create({
        data: {
          productId: batch.productId,
          type: "ADJUSTMENT",
          quantity: -batch.remaining,
          reason: "حذف دفعة مُدخلة بالخطأ",
        },
      });
      await tx.productBatch.delete({ where: { id } });
    });

    return NextResponse.json({ ok: true });
  });
}
