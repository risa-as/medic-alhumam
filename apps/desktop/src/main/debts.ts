// يستعلم ديون الزبائن مباشرة من الخادم (يتطلب اتصالًا + تسجيل دخول أونلاين).
// يُعرض في صفحة دفتر الديون بالديسكتوب كعرض قراءة.
// ملاحظة: مسارات /api/debts محميّة بهويّة المستخدم (requireRole) لا بمفتاح المزامنة،
// لذا نُصادق بتوكن JWT الخاص بالمستخدم (getCurrentUser().token) لا بـ syncSecret.
import { apiBaseUrl } from "./config";
import { getCurrentUser } from "./auth";

/** ترويسة موثّقة بالمستخدم (Bearer JWT) — أو null إن لم يكن هناك توكن (دخول أوفلاين/غير مسجّل). */
function userAuthHeader(): Record<string, string> | null {
  const token = getCurrentUser()?.token;
  return token ? { Authorization: `Bearer ${token}` } : null;
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

/** ديون زبون واحد مُجمّعة (يطابق شكل /api/debts المُجمّع). */
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

export async function fetchDebtsFromServer(status?: string): Promise<DebtListResult> {
  const auth = userAuthHeader();
  if (!auth) {
    return { data: [], totalAmount: 0, totalPaid: 0, totalRemaining: 0, online: false, error: "يجب تسجيل الدخول أونلاين لعرض الديون" };
  }
  const url = `${apiBaseUrl}/debts${status ? `?status=${status}` : ""}`;
  try {
    const res = await fetch(url, { headers: auth });
    if (res.status === 401 || res.status === 403) {
      return { data: [], totalAmount: 0, totalPaid: 0, totalRemaining: 0, online: true, error: "غير مصرّح — أعد تسجيل الدخول أونلاين" };
    }
    if (!res.ok) {
      return { data: [], totalAmount: 0, totalPaid: 0, totalRemaining: 0, online: true, error: `خطأ ${res.status}` };
    }
    // الخادم يعيد الديون مُجمّعة حسب الزبون (صفّ واحد لكل زبون + فواتيره)
    const raw = (await res.json()) as {
      data: CustomerDebtGroup[];
      totalAmount: number;
      totalPaid: number;
      totalRemaining: number;
    };
    return {
      data: raw.data,
      totalAmount: raw.totalAmount,
      totalPaid: raw.totalPaid,
      totalRemaining: raw.totalRemaining,
      online: true,
    };
  } catch {
    return { data: [], totalAmount: 0, totalPaid: 0, totalRemaining: 0, online: false, error: "تعذّر الوصول للخادم" };
  }
}

/** يسجّل دفعة سداد على حساب الزبون (تُوزَّع على فواتيره الأقدم أولًا على الخادم). */
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
