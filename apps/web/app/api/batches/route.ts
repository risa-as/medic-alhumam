import { NextResponse } from "next/server";
import { Prisma, prisma } from "@medic/database";
import { handleRoute } from "@/lib/api";
import { requireRole } from "@/lib/rbac";

/**
 * قائمة دفعات المخزون (FEFO) + ملخّص قيمة المخزون بالتكلفة.
 * ADMIN فقط — لأنها تكشف أسعار الشراء (FR-041).
 * فلاتر: productId، q (اسم/رمز المنتج)، status=active|depleted.
 */
export function GET(req: Request) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const sp = new URL(req.url).searchParams;
    const productId = sp.get("productId") ?? undefined;
    const status = sp.get("status"); // active | depleted | null(all)
    const q = sp.get("q")?.trim();

    const where: Prisma.ProductBatchWhereInput = {
      ...(productId && { productId }),
      ...(status === "active" && { remaining: { gt: 0 } }),
      ...(status === "depleted" && { remaining: { lte: 0 } }),
      ...(q && {
        product: {
          OR: [
            { nameAr: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
          ],
        },
      }),
    };

    const [rows, all] = await Promise.all([
      prisma.productBatch.findMany({
        where,
        include: { product: { select: { nameAr: true, sku: true } } },
        orderBy: [{ receivedAt: "desc" }, { createdAt: "desc" }],
        take: 500,
      }),
      // ملخّص شامل لكل الدفعات (مستقل عن الفلاتر) = لقطة المخزون بالتكلفة
      prisma.productBatch.findMany({ select: { remaining: true, costPrice: true } }),
    ]);

    const data = rows.map((b) => {
      const costPrice = Number(b.costPrice);
      return {
        id: b.id,
        productId: b.productId,
        productName: b.product.nameAr,
        productSku: b.product.sku,
        costPrice,
        quantity: b.quantity,
        remaining: b.remaining,
        consumed: b.quantity - b.remaining,
        stockValue: costPrice * b.remaining,
        expiryDate: b.expiryDate ? b.expiryDate.toISOString() : null,
        receivedAt: b.receivedAt.toISOString(),
        reason: b.reason,
      };
    });

    const activeBatches = all.filter((b) => b.remaining > 0);
    const stats = {
      totalBatches: all.length,
      activeBatches: activeBatches.length,
      unitsInStock: activeBatches.reduce((s, b) => s + b.remaining, 0),
      stockValue: activeBatches.reduce((s, b) => s + Number(b.costPrice) * b.remaining, 0),
    };

    return NextResponse.json({ data, stats });
  });
}
