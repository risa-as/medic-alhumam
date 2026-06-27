import { apiBaseUrl } from "./config";
import { getCurrentUser } from "./auth";
import { db } from "./db";

function authHeaders() {
  const user = getCurrentUser();
  if (!user?.token) throw new Error("يتطلب هذا الإجراء اتصالًا بالإنترنت");
  return { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` };
}

async function apiError(res: Response): Promise<string> {
  try {
    const b = (await res.json()) as { message?: string };
    return b.message ?? `خطأ ${res.status}`;
  } catch { return `خطأ ${res.status}`; }
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
  createdAt: string;
  salesCount: number;
  salesTotal: number;
  debts: CustomerDebt[];
  sales: CustomerSale[];
}

export async function fetchCustomers(q?: string): Promise<CustomerRow[]> {
  const url = `${apiBaseUrl}/customers${q ? `?q=${encodeURIComponent(q)}` : ""}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error(await apiError(res));
  const data = (await res.json()) as { data: CustomerRow[] };
  return data.data;
}

/** بحث في مرآة الزبائن المحلية (SQLite) — يعمل دون اتصال، يُستخدم لإكمال نقطة البيع.
 *  المرآة تُملأ من /api/sync/pull، لذا تعكس آخر مزامنة ناجحة. */
export async function searchLocalCustomers(q?: string): Promise<CustomerRow[]> {
  const term = q?.trim();
  const rows = await db.localCustomer.findMany({
    where: term
      ? { OR: [{ name: { contains: term } }, { phone: { contains: term } }] }
      : undefined,
    orderBy: { name: "asc" },
    take: 50,
  });
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    address: c.address,
    balance: c.balance,
  }));
}

export async function fetchCustomerDetail(id: string): Promise<CustomerDetail> {
  const res = await fetch(`${apiBaseUrl}/customers/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await apiError(res));
  return (await res.json()) as CustomerDetail;
}

/** يكتب الزبون في المرآة المحلية فورًا (دون انتظار المزامنة) لإبقاء بحث نقطة البيع متّسقًا. */
async function mirrorCustomer(c: { id: string; name: string; phone?: string | null; address?: string | null; balance?: number }) {
  const fields = {
    name: c.name,
    phone: c.phone ?? null,
    address: c.address ?? null,
    balance: c.balance ?? 0,
    updatedAt: new Date().toISOString(),
  };
  await db.localCustomer.upsert({ where: { id: c.id }, update: fields, create: { id: c.id, ...fields } });
}

export async function createCustomer(name: string, phone?: string, address?: string): Promise<CustomerRow> {
  const res = await fetch(`${apiBaseUrl}/customers`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name, phone: phone || undefined, address: address || undefined }),
  });
  if (!res.ok) throw new Error(await apiError(res));
  const row = (await res.json()) as CustomerRow;
  await mirrorCustomer(row); // زبون جديد ⇒ رصيد 0
  return row;
}

export async function updateCustomer(id: string, name: string, phone?: string, address?: string): Promise<CustomerRow> {
  const res = await fetch(`${apiBaseUrl}/customers/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ name, phone: phone || undefined, address: address || undefined }),
  });
  if (!res.ok) throw new Error(await apiError(res));
  const row = (await res.json()) as CustomerRow;
  // حافظ على الرصيد المحلي إن وُجد (PATCH لا يعيد الرصيد) — حدِّث الحقول النصية فقط
  const existing = await db.localCustomer.findUnique({ where: { id } });
  await mirrorCustomer({ ...row, balance: existing?.balance ?? 0 });
  return row;
}

export async function deleteCustomer(id: string): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/customers/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await apiError(res));
  await db.localCustomer.deleteMany({ where: { id } });
}
