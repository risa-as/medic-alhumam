export interface FinancialReport {
  from: string;
  to: string;
  groupBy: "day" | "week";
  totalRevenue: number;
  totalCost: number;
  costedRevenue: number;
  totalProfit: number;
  margin: number | null;
  discountsGiven: number;
  expensesTotal: number;
  netProfit: number;
  expensesByCategory: { category: string; amount: number }[];
  totalCount: number;
  avgOrder: number;
  previous: {
    totalRevenue: number;
    totalCount: number;
    discountsGiven: number;
    totalProfit: number;
    avgOrder: number;
    expensesTotal: number;
    netProfit: number;
  };
  series: { date: string; revenue: number; profit: number; count: number }[];
  topProducts: { productId: string; nameAr: string; totalQty: number; totalRevenue: number; totalProfit: number }[];
  byCategory: { name: string; revenue: number; profit: number }[];
  byPaymentType: { type: string; label: string; revenue: number; count: number }[];
  byUser: { name: string; revenue: number; count: number }[];
  byPlatform: { platform: string; label: string; revenue: number; count: number }[];
}

export interface InventoryReport {
  stockValueCost: number;
  stockValueRetail: number;
  potentialProfit: number;
  totalUnits: number;
  totalSkus: number;
  lowStockCount: number;
  lowStock: { id: string; nameAr: string; sku: string; quantity: number; minQuantity: number }[];
  deadStockCount: number;
  deadStockValue: number;
  deadStock: { id: string; nameAr: string; sku: string; quantity: number; value: number; lastUpdated: string }[];
  expiringCount: number;
  expiringValue: number;
  expiredCount: number;
  expiring: { id: string; nameAr: string; sku: string; remaining: number; value: number; expiryDate: string; daysLeft: number }[];
  byCategory: { name: string; cost: number; retail: number; units: number; potential: number }[];
  staleDays: number;
  expiryDays: number;
}
