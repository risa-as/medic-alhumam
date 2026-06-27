import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { handleRoute } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { serializeProduct } from "@/lib/services/products";

/** المنتجات التي بلغت كميتها حد التنبيه أو أقل (FR-009). */
export function GET() {
  return handleRoute(async () => {
    const user = await requireRole("ADMIN", "CASHIER");
    const products = await prisma.product.findMany({
      where: { quantity: { lte: prisma.product.fields.minQuantity } },
      orderBy: { quantity: "asc" },
      include: { category: true },
    });
    const hideCostPrice = user.role !== "ADMIN";
    return NextResponse.json({
      data: products.map((p) => ({ ...serializeProduct(p, hideCostPrice), category: p.category })),
    });
  });
}
