import type { CustomField, DebtStatus } from "@medic/core";

export interface Setting {
  id: string;
  storeName: string;
  logoUrl: string | null;
  currency: string;
  printerConfig: Record<string, unknown>;
  /** سعر التوصيل الفعلي لبغداد (قابل للتغيير). */
  deliveryCostBaghdad: number;
  /** سعر التوصيل الفعلي لبقية المحافظات (قابل للتغيير). */
  deliveryCostOther: number;
  updatedAt: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CASHIER";
  createdAt: string;
}

export interface Category {
  id: string;
  nameAr: string;
}

export interface Product {
  id: string;
  nameAr: string;
  sku: string;
  categoryId: string;
  costPrice: number;
  salePrice: number;
  compareAtPrice: number | null;
  deliveryPrice: number;
  quantity: number;
  minQuantity: number;
  images: string[];
  videoUrl: string | null;
  description: string | null;
  isOnline: boolean;
  customFields: CustomField[];
  category?: Category;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  selectedAttributes: Record<string, string>;
  product?: { nameAr: string; sku: string };
}

export interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  governorate: string;
  customerAddress: string | null;
  source: string;
  status: string;
  total: number;
  actualDeliveryCost: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  clientEventId: string | null;
  items: OrderItem[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  balance: number;
  createdAt: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  nameAr?: string;
  quantity: number;
  unitPrice: number;
  lineDiscount: number;
  lineTotal: number;
  product?: { nameAr: string; sku: string };
}

export interface Sale {
  id: string;
  invoiceNo: string;
  customerId: string | null;
  customerName: string | null;
  customerPhone: string | null;
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  remaining: number;
  paymentType: "CASH" | "CREDIT" | "PARTIAL";
  platform: "POS_DESKTOP" | "POS_MOBILE" | "WEB";
  createdAt: string;
  items: SaleItem[];
  customer?: { id: string; name: string; phone: string | null } | null;
}

export interface DebtPayment {
  id: string;
  amount: number;
  createdAt: string;
}

export interface Debt {
  id: string;
  customerId: string;
  amount: number;
  paid: number;
  remaining: number;
  status: DebtStatus;
  createdAt: string;
  updatedAt: string;
  customer: { id: string; name: string; phone: string | null };
  sale: { invoiceNo: string } | null;
  payments: DebtPayment[];
}

/** فاتورة دين مفردة ضمن مجموعة زبون (من /api/debts المُجمّع). */
export interface DebtInvoice {
  id: string;
  invoiceNo: string | null;
  amount: number;
  paid: number;
  remaining: number;
  status: DebtStatus;
  createdAt: string;
}

/** ديون زبون واحد مُجمّعة: صفّ واحد لكل زبون. */
export interface CustomerDebtGroup {
  id: string; // = customerId (مفتاح صفّ الجدول)
  customerId: string;
  customerName: string;
  customerPhone: string | null;
  amount: number;
  paid: number;
  remaining: number;
  status: DebtStatus;
  invoiceCount: number;
  invoices: DebtInvoice[];
}
