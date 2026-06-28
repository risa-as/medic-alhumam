// يستعلم ديون الزبائن مباشرة من الخادم (يتطلب اتصالًا + تسجيل دخول أونلاين).
import { apiBaseUrl } from "./config";
import { getCurrentUser } from "./auth";

function userAuthHeader(): Record<string, string> | null {
  const token = getCurrentUser()?.token;
  return token ? { Authorization: `Bearer ${token}` } : null;
}

export interface DebtInvoice {
  id: string;
  invoiceNo: string | null;
  amount: number;
  paid: number;
  remaining: number;
  status: string;
  createdAt: string;
}

export interface CustomerDebtGroup {
  id: string;
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

export interface StatementEntry {
  id: string;
  type: "DEBT" | "PAYMENT";
  date: string;
  invoiceNo?: string | null;
  amount: number;
  paid?: number;
  remaining?: number;
  status?: string;
  note?: string | null;
}

export interface CustomerStatementResult {
  entries: StatementEntry[];
  totalDebt: number;
  totalPaid: number;
  balance: number;
  online: boolean;
  error?: string;
}

/** يجلب الديون مع دعم الفلتر والبحث. */
export async function fetchDebtsFromServer(status?: string, search?: string): Promise<DebtListResult> {
  const auth = userAuthHeader();
  if (!auth) {
    return { data: [], totalAmount: 0, totalPaid: 0, totalRemaining: 0, online: false, error: "يجب تسجيل الدخول أونلاين لعرض الديون" };
  }
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (search?.trim()) params.set("search", search.trim());
  const qs = params.toString();
  const url = `${apiBaseUrl}/debts${qs ? `?${qs}` : ""}`;
  try {
    const res = await fetch(url, { headers: auth });
    if (res.status === 401 || res.status === 403) {
      return { data: [], totalAmount: 0, totalPaid: 0, totalRemaining: 0, online: true, error: "غير مصرّح — أعد تسجيل الدخول أونلاين" };
    }
    if (!res.ok) {
      return { data: [], totalAmount: 0, totalPaid: 0, totalRemaining: 0, online: true, error: `خطأ ${res.status}` };
    }
    const raw = (await res.json()) as {
      data: CustomerDebtGroup[];
      totalAmount: number;
      totalPaid: number;
      totalRemaining: number;
    };
    return { data: raw.data, totalAmount: raw.totalAmount, totalPaid: raw.totalPaid, totalRemaining: raw.totalRemaining, online: true };
  } catch {
    return { data: [], totalAmount: 0, totalPaid: 0, totalRemaining: 0, online: false, error: "تعذّر الوصول للخادم" };
  }
}

/** يسجّل دفعة سداد على حساب الزبون. */
export async function payCustomerDebtOnServer(customerId: string, amount: number): Promise<{ ok: boolean; error?: string }> {
  const auth = userAuthHeader();
  if (!auth) return { ok: false, error: "يجب تسجيل الدخول أونلاين لتسجيل دفعة" };
  try {
    const res = await fetch(`${apiBaseUrl}/customers/${customerId}/debt-payments`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
      return { ok: false, error: body?.error?.message ?? `خطأ ${res.status}` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "تعذّر الوصول للخادم" };
  }
}

/** يجلب كشف حساب الزبون (ديون + دفعات) من الخادم. */
export async function fetchCustomerStatementFromServer(customerId: string): Promise<CustomerStatementResult> {
  const auth = userAuthHeader();
  if (!auth) return { entries: [], totalDebt: 0, totalPaid: 0, balance: 0, online: false, error: "يجب تسجيل الدخول أونلاين" };
  try {
    const res = await fetch(`${apiBaseUrl}/customers/${customerId}/statement`, { headers: auth });
    if (!res.ok) {
      return { entries: [], totalDebt: 0, totalPaid: 0, balance: 0, online: true, error: `خطأ ${res.status}` };
    }
    const raw = (await res.json()) as CustomerStatementResult;
    return { ...raw, online: true };
  } catch {
    return { entries: [], totalDebt: 0, totalPaid: 0, balance: 0, online: false, error: "تعذّر الوصول للخادم" };
  }
}
