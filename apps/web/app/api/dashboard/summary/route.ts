import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { handleRoute } from "@/lib/api";
import { requireRole } from "@/lib/rbac";

export function GET() {
  return handleRoute(async () => {
    await requireRole("ADMIN");

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [todaySales, topItems, lowStockProducts, pendingOrders, reviewCount] = await Promise.all([
      prisma.sale.findMany({
        where: { createdAt: { gte: todayStart, lte: todayEnd } },
        select: { total: true },
      }),
      prisma.saleItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.product.findMany({
        where: { quantity: { lte: prisma.product.fields.minQuantity } },
        select: { id: true, nameAr: true, quantity: true, minQuantity: true },
        orderBy: { quantity: "asc" },
        take: 10,
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.stockMovement.count({ where: { needsReview: true } }),
    ]);

    const todayRevenue = todaySales.reduce((sum, s) => sum + Number(s.total), 0);

    // ربح اليوم (FEFO) — على الأسطر المُسعّرة فقط
    const todayCostAgg = await prisma.saleItem.aggregate({
      where: {
        costTotal: { not: null },
        sale: { createdAt: { gte: todayStart, lte: todayEnd } },
      },
      _sum: { costTotal: true, lineTotal: true },
    });
    const todayCost = Number(todayCostAgg._sum.costTotal ?? 0);
    const todayProfit = Number(todayCostAgg._sum.lineTotal ?? 0) - todayCost;

    const topProductIds = topItems.map((i) => i.productId);
    const topProductNames = topProductIds.length
      ? await prisma.product.findMany({
          where: { id: { in: topProductIds } },
          select: { id: true, nameAr: true },
        })
      : [];
    const nameMap = Object.fromEntries(topProductNames.map((p) => [p.id, p.nameAr]));

    const topProducts = topItems.map((i) => ({
      productId: i.productId,
      nameAr: nameMap[i.productId] ?? i.productId,
      totalQty: i._sum.quantity ?? 0,
    }));

    return NextResponse.json({
      todayRevenue,
      todayProfit,
      todayCount: todaySales.length,
      topProducts,
      lowStockAlerts: lowStockProducts,
      pendingOrders,
      reviewCount,
    });
  });
}
