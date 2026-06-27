import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { handleRoute } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { saleInclude } from "@/lib/services/sales";

export function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN", "CASHIER");
    const { id } = await params;
    const sale = await prisma.sale.findUnique({ where: { id }, include: saleInclude });
    if (!sale) throw new ApiError(404, "SALE_NOT_FOUND", "الفاتورة غير موجودة");
    return NextResponse.json(sale);
  });
}
