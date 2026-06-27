import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { restrictedStockMovementSchema, applyStockMovement } from "@medic/core";
import { handleRoute, parseBody, ApiError } from "@/lib/api";
import { requireRole } from "@/lib/rbac";

export function GET(req: Request) {
  return handleRoute(async () => {
    await requireRole("ADMIN", "CASHIER");
    const sp = new URL(req.url).searchParams;
    const productId = sp.get("productId") ?? undefined;
    const needsReview = sp.get("needsReview") === "1";
    const where = {
      ...(productId && { productId }),
      ...(needsReview && { needsReview: true }),
    };
    const movements = await prisma.stockMovement.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { product: { select: { nameAr: true, sku: true } } },
    });
    return NextResponse.json({ data: movements });
  });
}

export function POST(req: Request) {
  return handleRoute(async () => {
    await requireRole("ADMIN", "CASHIER");
    const input = await parseBody(req, restrictedStockMovementSchema);

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: input.productId } });
      if (!product) throw new ApiError(404, "PRODUCT_NOT_FOUND", "المنتج غير موجود");

      let nextQty: number;
      try {
        nextQty = applyStockMovement(product.quantity, input.type, input.quantity);
      } catch (e) {
        throw new ApiError(409, "INVALID_MOVEMENT", e instanceof Error ? e.message : "حركة غير صالحة");
      }

      // إدخال شحنة (PURCHASE) ⇒ دفعة FEFO بسعر شرائها + تحديث سعر الشراء المرجعي للمنتج
      if (input.type === "PURCHASE" && input.costPrice != null) {
        await tx.productBatch.create({
          data: {
            productId: product.id,
            costPrice: input.costPrice,
            quantity: input.quantity,
            remaining: input.quantity,
            expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
            reason: input.reason ?? null,
          },
        });
        await tx.product.update({
          where: { id: product.id },
          data: { quantity: nextQty, costPrice: input.costPrice },
        });
      } else {
        await tx.product.update({ where: { id: product.id }, data: { quantity: nextQty } });
      }

      const movement = await tx.stockMovement.create({
        data: {
          productId: product.id,
          type: input.type,
          quantity: input.quantity,
          reason: input.reason ?? null,
        },
      });
      return { movement, quantity: nextQty };
    });

    return NextResponse.json(result, { status: 201 });
  });
}
