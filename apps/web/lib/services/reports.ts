import { prisma } from "@medic/database";
import { getExpensesSummary } from "./expenses";

const PLATFORM_LABEL: Record<string, string> = {
  POS_DESKTOP: "سطح المكتب",
  POS_MOBILE: "الهاتف",
  WEB: "الويب",
};
const PAYMENT_LABEL: Record<string, string> = {
  CASH: "نقدي",
  CREDIT: "آجل",
  PARTIAL: "جزئي",
};

const DAY_MS = 86_400_000;

/** فلتر نطاق وقت يومي يُطبَّق على كل يوم ضمن المدى. fromMin/toMin دقائق من منتصف الليل
 *  بالتوقيت المحلي، و tzOffset = Date.getTimezoneOffset() (سالب لما يسبق UTC، مثل العراق -180). */
export interface TimeOfDayFilter {
  fromMin: number;
  toMin: number;
  tzOffset: number;
}

/** هل يقع التوقيت (UTC) ضمن نطاق الوقت اليومي المحلي؟ يدعم النطاق العابر لمنتصف الليل. */
function inTimeWindow(createdAt: Date, tf: TimeOfDayFilter | null): boolean {
  if (!tf) return true;
  const localMin = ((Math.floor(createdAt.getTime() / 60000 - tf.tzOffset) % 1440) + 1440) % 1440;
  return tf.fromMin <= tf.toMin
    ? localMin >= tf.fromMin && localMin < tf.toMin
    : localMin >= tf.fromMin || localMin < tf.toMin;
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}
function weekKey(d: Date): string {
  // مفتاح الأسبوع = تاريخ الأحد الذي يبدأ به الأسبوع
  const c = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  c.setUTCDate(c.getUTCDate() - c.getUTCDay());
  return c.toISOString().slice(0, 10);
}

/** إجماليات مالية مختصرة لنافذة زمنية — تُستخدم للمقارنة بالفترة السابقة (مع فلتر الوقت اليومي). */
async function periodTotals(from: Date, to: Date, tf: TimeOfDayFilter | null) {
  const rows = await prisma.sale.findMany({
    where: { createdAt: { gte: from, lte: to } },
    select: { id: true, total: true, discount: true, createdAt: true },
  });
  const sales = tf ? rows.filter((s) => inTimeWindow(s.createdAt, tf)) : rows;
  const ids = sales.map((s) => s.id);
  const [cost, exp] = await Promise.all([
    ids.length
      ? prisma.saleItem.aggregate({
          where: { saleId: { in: ids }, costTotal: { not: null } },
          _sum: { costTotal: true, lineTotal: true },
        })
      : null,
    prisma.expense.aggregate({
      where: { spentAt: { gte: from, lte: to } },
      _sum: { amount: true },
    }),
  ]);
  const totalRevenue = sales.reduce((s, x) => s + Number(x.total), 0);
  const totalCount = sales.length;
  const totalCost = Number(cost?._sum.costTotal ?? 0);
  const costedRevenue = Number(cost?._sum.lineTotal ?? 0);
  const totalProfit = costedRevenue - totalCost;
  const expensesTotal = Number(exp._sum.amount ?? 0);
  return {
    totalRevenue,
    totalCount,
    discountsGiven: sales.reduce((s, x) => s + Number(x.discount), 0),
    totalProfit,
    avgOrder: totalCount ? Math.round(totalRevenue / totalCount) : 0,
    expensesTotal,
    netProfit: totalProfit - expensesTotal,
  };
}

/**
 * التقرير المالي: إجماليات + ربح FEFO + مقارنة بالفترة السابقة + سلسلة زمنية
 * (إيراد/ربح) + تفصيل حسب طريقة الدفع/الفئة/الموظف/المنصّة + أكثر المنتجات.
 */
export async function getFinancialReport(
  from: Date,
  to: Date,
  groupBy: "day" | "week",
  timeFilter: TimeOfDayFilter | null = null,
) {
  const len = to.getTime() - from.getTime();
  const prevTo = from;
  const prevFrom = new Date(from.getTime() - len);

  const allSales = await prisma.sale.findMany({
    where: { createdAt: { gte: from, lte: to } },
    select: {
      id: true,
      total: true,
      discount: true,
      paymentType: true,
      createdAt: true,
      platform: true,
      userId: true,
      user: { select: { name: true } },
    },
  });
  // فلتر نطاق الوقت اليومي (مثلًا 8ص–4م) يُطبَّق على كل يوم ضمن المدى المختار.
  const sales = timeFilter ? allSales.filter((s) => inTimeWindow(s.createdAt, timeFilter)) : allSales;
  const saleIds = sales.map((s) => s.id);

  const [costAgg, profitBySale, allByProduct, costedByProduct, previous, expenses] = await Promise.all([
    saleIds.length
      ? prisma.saleItem.aggregate({
          where: { saleId: { in: saleIds }, costTotal: { not: null } },
          _sum: { costTotal: true, lineTotal: true },
        })
      : null,
    saleIds.length
      ? prisma.saleItem.groupBy({
          by: ["saleId"],
          where: { saleId: { in: saleIds }, costTotal: { not: null } },
          _sum: { costTotal: true, lineTotal: true },
        })
      : [],
    saleIds.length
      ? prisma.saleItem.groupBy({
          by: ["productId"],
          where: { saleId: { in: saleIds } },
          _sum: { quantity: true, lineTotal: true },
        })
      : [],
    saleIds.length
      ? prisma.saleItem.groupBy({
          by: ["productId"],
          where: { saleId: { in: saleIds }, costTotal: { not: null } },
          _sum: { lineTotal: true, costTotal: true },
        })
      : [],
    periodTotals(prevFrom, prevTo, timeFilter),
    getExpensesSummary(from, to),
  ]);

  // ─── الإجماليات الحالية ───
  const totalRevenue = sales.reduce((s, x) => s + Number(x.total), 0);
  const discountsGiven = sales.reduce((s, x) => s + Number(x.discount), 0);
  const totalCount = sales.length;
  const totalCost = Number(costAgg?._sum.costTotal ?? 0);
  const costedRevenue = Number(costAgg?._sum.lineTotal ?? 0);
  const totalProfit = costedRevenue - totalCost;
  const avgOrder = totalCount ? Math.round(totalRevenue / totalCount) : 0;
  const margin = costedRevenue > 0 ? Math.round((totalProfit / costedRevenue) * 100) : null;
  const expensesTotal = expenses.total;
  const netProfit = totalProfit - expensesTotal;

  // ─── السلسلة الزمنية (إيراد + ربح لكل فترة) ───
  const profitMap = new Map(
    profitBySale.map((r) => [r.saleId, Number(r._sum.lineTotal ?? 0) - Number(r._sum.costTotal ?? 0)]),
  );
  const seriesMap = new Map<string, { revenue: number; profit: number; count: number }>();
  const byUser = new Map<string, { name: string; revenue: number; count: number }>();
  const byPlatform = new Map<string, { revenue: number; count: number }>();
  const byPayment = new Map<string, { revenue: number; count: number }>();

  for (const s of sales) {
    const amount = Number(s.total);
    const key = groupBy === "week" ? weekKey(s.createdAt) : dayKey(s.createdAt);
    const cur = seriesMap.get(key) ?? { revenue: 0, profit: 0, count: 0 };
    cur.revenue += amount;
    cur.profit += profitMap.get(s.id) ?? 0;
    cur.count += 1;
    seriesMap.set(key, cur);

    const u = byUser.get(s.userId) ?? { name: s.user?.name ?? "—", revenue: 0, count: 0 };
    u.revenue += amount;
    u.count += 1;
    byUser.set(s.userId, u);

    const pl = byPlatform.get(s.platform) ?? { revenue: 0, count: 0 };
    pl.revenue += amount;
    pl.count += 1;
    byPlatform.set(s.platform, pl);

    const pay = byPayment.get(s.paymentType) ?? { revenue: 0, count: 0 };
    pay.revenue += amount;
    pay.count += 1;
    byPayment.set(s.paymentType, pay);
  }

  // تعبئة كامل الفترة المحدّدة حتى يمتدّ المخطط على المدى كله (الأيام/الأسابيع بلا مبيعات = صفر)
  const cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const endDay = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()));
  if (groupBy === "week") cursor.setUTCDate(cursor.getUTCDate() - cursor.getUTCDay()); // محاذاة لبداية الأسبوع (الأحد)
  const step = groupBy === "week" ? 7 : 1;
  for (let guard = 0; cursor <= endDay && guard < 1500; guard++) {
    const key = groupBy === "week" ? weekKey(cursor) : dayKey(cursor);
    if (!seriesMap.has(key)) seriesMap.set(key, { revenue: 0, profit: 0, count: 0 });
    cursor.setUTCDate(cursor.getUTCDate() + step);
  }

  const series = [...seriesMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, revenue: v.revenue, profit: v.profit, count: v.count }));

  // ─── المنتجات والفئات ───
  const productIds = allByProduct.map((p) => p.productId);
  const products = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, nameAr: true, categoryId: true, category: { select: { nameAr: true } } },
      })
    : [];
  const pInfo = new Map(products.map((p) => [p.id, p]));
  const costedMap = new Map(
    costedByProduct.map((p) => [
      p.productId,
      { revenue: Number(p._sum.lineTotal ?? 0), cost: Number(p._sum.costTotal ?? 0) },
    ]),
  );

  const topProducts = [...allByProduct]
    .sort((a, b) => (b._sum.quantity ?? 0) - (a._sum.quantity ?? 0))
    .slice(0, 10)
    .map((p) => {
      const c = costedMap.get(p.productId);
      return {
        productId: p.productId,
        nameAr: pInfo.get(p.productId)?.nameAr ?? p.productId,
        totalQty: p._sum.quantity ?? 0,
        totalRevenue: Number(p._sum.lineTotal ?? 0),
        totalProfit: c ? c.revenue - c.cost : 0,
      };
    });

  const byCatMap = new Map<string, { name: string; revenue: number; profit: number }>();
  for (const p of allByProduct) {
    const info = pInfo.get(p.productId);
    const catId = info?.categoryId ?? "—";
    const cat = byCatMap.get(catId) ?? { name: info?.category?.nameAr ?? "—", revenue: 0, profit: 0 };
    cat.revenue += Number(p._sum.lineTotal ?? 0);
    const c = costedMap.get(p.productId);
    if (c) cat.profit += c.revenue - c.cost;
    byCatMap.set(catId, cat);
  }
  const byCategory = [...byCatMap.values()].sort((a, b) => b.revenue - a.revenue);

  return {
    from: from.toISOString(),
    to: to.toISOString(),
    groupBy,
    totalRevenue,
    totalCost,
    costedRevenue,
    totalProfit,
    margin,
    discountsGiven,
    expensesTotal,
    netProfit,
    expensesByCategory: expenses.byCategory,
    totalCount,
    avgOrder,
    previous,
    series,
    topProducts,
    byCategory,
    byPaymentType: [...byPayment.entries()].map(([type, v]) => ({
      type,
      label: PAYMENT_LABEL[type] ?? type,
      revenue: v.revenue,
      count: v.count,
    })),
    byUser: [...byUser.values()].sort((a, b) => b.revenue - a.revenue),
    byPlatform: [...byPlatform.entries()].map(([platform, v]) => ({
      platform,
      label: PLATFORM_LABEL[platform] ?? platform,
      revenue: v.revenue,
      count: v.count,
    })),
  };
}

/**
 * تقرير المخزون (لقطة حالية): قيمة المخزون، النواقص، الركود (بلا مبيعات ضمن نافذة)،
 * قرب انتهاء الصلاحية، والقيمة حسب الفئة.
 */
export async function getInventoryReport({
  staleDays = 60,
  expiryDays = 60,
}: { staleDays?: number; expiryDays?: number } = {}) {
  const now = new Date();
  const staleSince = new Date(now.getTime() - staleDays * DAY_MS);
  const expiryBefore = new Date(now.getTime() + expiryDays * DAY_MS);

  const [products, soldRecently, batches] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true, nameAr: true, sku: true, quantity: true, minQuantity: true,
        costPrice: true, salePrice: true, categoryId: true,
        category: { select: { nameAr: true } }, updatedAt: true,
      },
    }),
    prisma.saleItem.groupBy({
      by: ["productId"],
      where: { sale: { createdAt: { gte: staleSince } } },
    }),
    prisma.productBatch.findMany({
      where: { remaining: { gt: 0 }, expiryDate: { not: null, lte: expiryBefore } },
      select: {
        id: true, remaining: true, costPrice: true, expiryDate: true,
        product: { select: { nameAr: true, sku: true } },
      },
    }),
  ]);

  const soldSet = new Set(soldRecently.map((s) => s.productId));

  let stockValueCost = 0;
  let stockValueRetail = 0;
  let totalUnits = 0;
  const byCatMap = new Map<string, { name: string; cost: number; retail: number; units: number }>();
  const lowStock: { id: string; nameAr: string; sku: string; quantity: number; minQuantity: number }[] = [];
  const deadStock: { id: string; nameAr: string; sku: string; quantity: number; value: number; lastUpdated: string }[] = [];

  for (const p of products) {
    const cost = Number(p.costPrice);
    const sale = Number(p.salePrice);
    const qty = p.quantity;
    stockValueCost += qty * cost;
    stockValueRetail += qty * sale;
    totalUnits += qty;

    const cat = byCatMap.get(p.categoryId) ?? { name: p.category?.nameAr ?? "—", cost: 0, retail: 0, units: 0 };
    cat.cost += qty * cost;
    cat.retail += qty * sale;
    cat.units += qty;
    byCatMap.set(p.categoryId, cat);

    if (qty <= p.minQuantity) {
      lowStock.push({ id: p.id, nameAr: p.nameAr, sku: p.sku, quantity: qty, minQuantity: p.minQuantity });
    }
    if (qty > 0 && !soldSet.has(p.id)) {
      deadStock.push({ id: p.id, nameAr: p.nameAr, sku: p.sku, quantity: qty, value: qty * cost, lastUpdated: p.updatedAt.toISOString() });
    }
  }
  lowStock.sort((a, b) => a.quantity - b.quantity);
  deadStock.sort((a, b) => b.value - a.value);

  const expiring = batches
    .map((b) => {
      const exp = b.expiryDate!;
      return {
        id: b.id,
        nameAr: b.product.nameAr,
        sku: b.product.sku,
        remaining: b.remaining,
        value: b.remaining * Number(b.costPrice),
        expiryDate: exp.toISOString(),
        daysLeft: Math.ceil((exp.getTime() - now.getTime()) / DAY_MS),
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const byCategory = [...byCatMap.values()]
    .map((c) => ({ ...c, potential: c.retail - c.cost }))
    .sort((a, b) => b.cost - a.cost);

  return {
    stockValueCost,
    stockValueRetail,
    potentialProfit: stockValueRetail - stockValueCost,
    totalUnits,
    totalSkus: products.length,
    lowStockCount: lowStock.length,
    lowStock: lowStock.slice(0, 50),
    deadStockCount: deadStock.length,
    deadStockValue: deadStock.reduce((s, d) => s + d.value, 0),
    deadStock: deadStock.slice(0, 50),
    expiringCount: expiring.length,
    expiringValue: expiring.reduce((s, e) => s + e.value, 0),
    expiredCount: expiring.filter((e) => e.daysLeft < 0).length,
    expiring: expiring.slice(0, 50),
    byCategory,
    staleDays,
    expiryDays,
  };
}
