export interface LocalProduct {
  id: string;
  nameAr: string;
  sku: string;
  salePrice: number;
  quantity: number;
  minQuantity: number;
  isOnline: boolean;
  updatedAt?: string;
}

export interface Category {
  id: string;
  nameAr: string;
}

export interface ProductCustomField {
  id: string;
  name: string;
  type: "select" | "text";
  options?: string[];
  required: boolean;
}

export interface ProductCreateInput {
  nameAr: string;
  sku: string;
  categoryId: string;
  costPrice: number;
  salePrice: number;
  compareAtPrice?: number | null;
  quantity: number;
  minQuantity: number;
  isOnline: boolean;
  description?: string;
  images?: string[];
  videoUrl?: string;
  customFields?: ProductCustomField[];
}

export interface ProductUpdateInput {
  nameAr?: string;
  sku?: string;
  salePrice?: number;
  minQuantity?: number;
  isOnline?: boolean;
  description?: string;
}

export interface LocalSaleItem {
  id: string;
  productId: string;
  nameAr: string;
  quantity: number;
  unitPrice: number;
  lineDiscount: number;
  lineTotal: number;
}

export interface LocalSale {
  id: string;
  clientEventId: string;
  invoiceNo: string;
  customerName: string | null;
  customerPhone: string | null;
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  remaining: number;
  paymentType: string;
  /** عُدِّل سعر أحد أصنافها يدويًا في نقطة البيع */
  priceEdited: boolean;
  synced: boolean;
  createdAt: string;
  items: LocalSaleItem[];
}

/** فلاتر سجل الفواتير (بحث برقم الفاتورة + نطاق زمني). */
export interface SalesFilter {
  invoiceNo?: string;
  from?: string;
  to?: string;
}

export interface SyncStatus {
  pending: number;
  lastPullAt: string | null;
  online: boolean;
}

export interface ConnectionTestResult {
  reachable: boolean;
  authorized: boolean;
  productCount: number;
  userCount: number;
  latencyMs: number;
  error: string | null;
}

export interface AppInfo {
  version: string;
  electron: string;
  platform: string;
  userDataPath: string;
}

/** فاتورة دين مفردة ضمن مجموعة زبون. */
export interface DebtInvoice {
  id: string;
  invoiceNo: string | null;
  amount: number;
  paid: number;
  remaining: number;
  status: string;
  createdAt: string;
}

/** ديون زبون واحد مُجمّعة: صفّ واحد لكل زبون + فواتيره. */
export interface CustomerDebtGroup {
  id: string; // = customerId (مفتاح صفّ الجدول)
  customerId: string;
  customerName: string;
  customerPhone: string | null;
  amount: number;
  paid: number;
  remaining: number;
  status: string;
  invoiceCount: number;
  invoices: DebtInvoice[];
}

export interface DebtListResult {
  data: CustomerDebtGroup[];
  totalAmount: number;
  totalPaid: number;
  totalRemaining: number;
  online: boolean;
  error?: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CASHIER";
  token?: string;
}

export interface LocalSettings {
  serverUrl: string;
  syncSecret: string;
}

export interface CustomerRow {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  balance: number;
}

export interface CustomerDebt {
  id: string;
  amount: number;
  paid: number;
  remaining: number;
  status: string;
  sale: { invoiceNo: string } | null;
  createdAt: string;
}

export interface CustomerSale {
  id: string;
  invoiceNo: string;
  total: number;
  paymentType: string;
  createdAt: string;
}

export interface CustomerDetail extends CustomerRow {
  /** تاريخ تسجيل الزبون (ISO) */
  createdAt: string;
  /** إجمالي عدد فواتير الزبون (عبر كل الفواتير لا آخر 10) */
  salesCount: number;
  /** مجموع قيمة كل فواتير الزبون */
  salesTotal: number;
  debts: CustomerDebt[];
  sales: CustomerSale[];
}

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
  todayProfit: number | null;
}

export interface MedicApi {
  listProducts: (query?: string) => Promise<LocalProduct[]>;
  findProductByBarcode: (barcode: string) => Promise<LocalProduct | null>;
  createSale: (input: {
    items: { productId: string; quantity: number; unitPrice?: number; lineDiscount?: number }[];
    discount?: number;
    paid?: number;
    customerName?: string;
    customerPhone?: string;
  }) => Promise<LocalSale>;
  listSales: (filter?: SalesFilter) => Promise<LocalSale[]>;
  getSale: (id: string) => Promise<LocalSale | null>;
  syncNow: () => Promise<SyncStatus>;
  syncStatus: () => Promise<SyncStatus>;
  testConnection: (serverUrl: string, syncSecret: string) => Promise<ConnectionTestResult>;
  appInfo: () => Promise<AppInfo>;
  listDebts: (status?: string) => Promise<DebtListResult>;
  payCustomerDebt: (customerId: string, amount: number) => Promise<{ ok: boolean; error?: string }>;
  getLocalSettings: () => Promise<LocalSettings>;
  saveLocalSettings: (cfg: { serverUrl?: string; syncSecret?: string }) => Promise<{ ok: boolean }>;
  login: (email: string, password: string) => Promise<SessionUser>;
  logout: () => Promise<{ ok: boolean }>;
  currentUser: () => Promise<SessionUser | null>;
  getDashboardStats: () => Promise<DashboardStats>;
  listCustomers:     (q?: string) => Promise<CustomerRow[]>;
  searchLocalCustomers: (q?: string) => Promise<CustomerRow[]>;
  getCustomerDetail: (id: string) => Promise<CustomerDetail>;
  createCustomer:    (name: string, phone?: string, address?: string) => Promise<CustomerRow>;
  updateCustomer:    (id: string, name: string, phone?: string, address?: string) => Promise<CustomerRow>;
  deleteCustomer:    (id: string) => Promise<void>;
  // إدارة المخزون
  listCategories: () => Promise<Category[]>;
  createProduct: (input: ProductCreateInput) => Promise<{ id: string; nameAr: string }>;
  updateProduct: (id: string, input: ProductUpdateInput) => Promise<{ id: string; nameAr: string }>;
  deleteProduct: (id: string) => Promise<{ ok: boolean }>;
  purchaseStock: (productId: string, quantity: number, costPrice: number) => Promise<{ ok: boolean }>;
  uploadProductMedia: (
    kind: "image" | "video",
    files: { name: string; type: string; data: ArrayBuffer }[],
  ) => Promise<string[]>;
}

declare global {
  interface Window {
    medic: MedicApi;
  }
}
