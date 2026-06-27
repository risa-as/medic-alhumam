import { db } from "./db";
import { apiBaseUrl } from "./config";
import { getCurrentUser } from "./auth";

export interface RecentSaleRow {
  id: string;
  invoiceNo: string;
  customerName: string | null;
  total: number;
  remaining: number;
  synced: boolean;
  createdAt: string;
  paymentType: string;
}

export interface DashboardStats {
  todayRevenue: number;
  todayCount: number;
  totalProducts: number;
  lowStockCount: number;
  pendingSyncCount: number;
  recentSales: RecentSaleRow[];
  lastPullAt: string | null;
  // ربح اليوم (FEFO) من الخادم — null عند عدم الاتصال أو لغير المدير
  todayProfit: number | null;
}

/** يجلب ربح اليوم المحسوب بنظام FEFO من الخادم (يتطلّب اتصالًا + دور ADMIN). */
async function fetchTodayProfit(): Promise<number | null> {
  const user = getCurrentUser();
  if (!user?.token) return null;
  try {
    const res = await fetch(`${apiBaseUrl}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (!res.ok) return null; // 403 لغير المدير، أو خطأ شبكة
    const data = (await res.json()) as { todayProfit?: number };
    return typeof data.todayProfit === "number" ? data.todayProfit : null;
  } catch {
    return null;
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayISO = todayStart.toISOString();

  const [todayAgg, recentSales, products, pendingSyncCount, meta, todayProfit] = await Promise.all([
    db.localSale.aggregate({
      where: { createdAt: { gte: todayISO } },
      _sum: { total: true },
      _count: { id: true },
    }),
    db.localSale.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        invoiceNo: true,
        customerName: true,
        total: true,
        remaining: true,
        synced: true,
        createdAt: true,
        paymentType: true,
      },
    }),
    db.localProduct.findMany({
      select: { quantity: true, minQuantity: true },
    }),
    db.syncQueueItem.count({ where: { status: "PENDING" } }),
    db.meta.findUnique({ where: { key: "lastPullAt" } }),
    fetchTodayProfit(),
  ]);

  const lowStockCount = products.filter((p) => p.quantity <= p.minQuantity).length;

  return {
    todayRevenue: todayAgg._sum.total ?? 0,
    todayCount: todayAgg._count.id,
    totalProducts: products.length,
    lowStockCount,
    pendingSyncCount,
    recentSales,
    lastPullAt: meta?.value ?? null,
    todayProfit,
  };
}
