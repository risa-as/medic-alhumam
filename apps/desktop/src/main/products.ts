import { apiBaseUrl } from "./config";
import { getCurrentUser } from "./auth";
import { db } from "./db";
import { pullProducts } from "./sync";

function jwtHeaders() {
  const user = getCurrentUser();
  if (!user?.token) throw new Error("يتطلب هذا الإجراء اتصالًا بالإنترنت — يُرجى تسجيل الدخول أونلاين");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.token}`,
  };
}

async function apiError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string };
    return body.message ?? `خطأ ${res.status}`;
  } catch {
    return `خطأ ${res.status}`;
  }
}

/* ─── جلب الفئات ─── */
export async function fetchCategoriesFromServer(): Promise<Array<{ id: string; nameAr: string }>> {
  const user = getCurrentUser();
  if (!user?.token) return [];
  try {
    const res = await fetch(`${apiBaseUrl}/categories`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { data: Array<{ id: string; nameAr: string }> };
    return data.data;
  } catch {
    return [];
  }
}

/* ─── إنشاء منتج ─── */
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

export async function createProductOnServer(input: ProductCreateInput) {
  const res = await fetch(`${apiBaseUrl}/products`, {
    method: "POST",
    headers: jwtHeaders(),
    body: JSON.stringify({
      ...input,
      images: input.images ?? [],
      customFields: input.customFields ?? [],
    }),
  });
  if (!res.ok) throw new Error(await apiError(res));
  const product = await res.json();
  await pullProducts().catch(() => {});
  return product as { id: string; nameAr: string };
}

/* ─── تعديل منتج ─── */
export interface ProductUpdateInput {
  nameAr?: string;
  sku?: string;
  salePrice?: number;
  minQuantity?: number;
  isOnline?: boolean;
  description?: string;
}

export async function updateProductOnServer(id: string, input: ProductUpdateInput) {
  const res = await fetch(`${apiBaseUrl}/products/${id}`, {
    method: "PATCH",
    headers: jwtHeaders(),
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await apiError(res));
  const product = await res.json();
  await pullProducts().catch(() => {});
  return product as { id: string; nameAr: string };
}

/* ─── حذف منتج ─── */
export async function deleteProductOnServer(id: string) {
  const res = await fetch(`${apiBaseUrl}/products/${id}`, {
    method: "DELETE",
    headers: jwtHeaders(),
  });
  if (!res.ok) throw new Error(await apiError(res));
  await db.localProduct.deleteMany({ where: { id } }).catch(() => {});
  return { ok: true };
}

/* ─── إضافة شحنة مخزون ─── */
export async function purchaseStockOnServer(productId: string, quantity: number, costPrice: number) {
  const res = await fetch(`${apiBaseUrl}/stock-movements`, {
    method: "POST",
    headers: jwtHeaders(),
    body: JSON.stringify({ productId, type: "PURCHASE", quantity, costPrice, reason: "إدخال شحنة من الديسكتوب" }),
  });
  if (!res.ok) throw new Error(await apiError(res));
  // تحديث الكمية محليًا فورًا
  await db.localProduct.update({
    where: { id: productId },
    data: { quantity: { increment: quantity } },
  }).catch(() => {});
  return { ok: true };
}
