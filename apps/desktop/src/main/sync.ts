import { db } from "./db";
import { apiBaseUrl, config } from "./config";

const authHeader = { Authorization: `Bearer ${config.syncSecret}` };

export interface SyncStatus {
  pending: number;
  lastPullAt: string | null;
  online: boolean;
}

export interface ConnectionTestResult {
  /** الخادم متاح ويردّ على /api/health */
  reachable: boolean;
  /** مفتاح المزامنة صحيح (قبله /api/sync/pull) */
  authorized: boolean;
  /** عدد المنتجات التي ستُزامَن */
  productCount: number;
  /** عدد المستخدمين الذين ستُسحب مرآتهم */
  userCount: number;
  /** زمن استجابة الخادم بالميلي ثانية */
  latencyMs: number;
  /** رسالة الخطأ إن فشل أي تحقق */
  error: string | null;
}

/**
 * يتحقّق من إعدادات الاتصال المُدخَلة *قبل* حفظها (FR — التحقق):
 * 1) يتأكّد أن الخادم متاح عبر GET /api/health (دون مصادقة).
 * 2) يتأكّد أن مفتاح المزامنة صحيح عبر GET /api/sync/pull (Bearer).
 * لا يرمي أبدًا — يُرجع نتيجة منظّمة لعرضها في الواجهة.
 */
export async function testConnection(
  serverUrl: string,
  syncSecret: string,
): Promise<ConnectionTestResult> {
  const result: ConnectionTestResult = {
    reachable: false,
    authorized: false,
    productCount: 0,
    userCount: 0,
    latencyMs: 0,
    error: null,
  };

  const base = `${serverUrl.trim().replace(/\/+$/, "")}/api`;
  const started = Date.now();

  try {
    // 1) توفّر الخادم
    const health = await fetch(`${base}/health`, { signal: AbortSignal.timeout(8000) });
    result.reachable = health.ok;
    if (!health.ok) {
      result.latencyMs = Date.now() - started;
      result.error = `الخادم ردّ بحالة ${health.status} — تحقّق من العنوان`;
      return result;
    }

    // 2) صحّة مفتاح المزامنة + معاينة البيانات
    const pull = await fetch(`${base}/sync/pull`, {
      headers: { Authorization: `Bearer ${syncSecret}` },
      signal: AbortSignal.timeout(8000),
    });
    result.latencyMs = Date.now() - started;

    if (pull.status === 401) {
      result.error = "مفتاح المزامنة غير صحيح — لا يطابق الخادم";
      return result;
    }
    if (!pull.ok) {
      result.error = `تعذّر التحقق من المفتاح (حالة ${pull.status})`;
      return result;
    }

    const data = (await pull.json()) as {
      products?: unknown[];
      users?: unknown[];
    };
    result.authorized = true;
    result.productCount = data.products?.length ?? 0;
    result.userCount = data.users?.length ?? 0;
    return result;
  } catch {
    result.latencyMs = Date.now() - started;
    result.error = result.reachable
      ? "انتهت مهلة التحقق من المفتاح"
      : "تعذّر الوصول إلى الخادم — تأكّد من العنوان والاتصال بالإنترنت";
    return result;
  }
}

async function getMeta(key: string): Promise<string | null> {
  const row = await db.meta.findUnique({ where: { key } });
  return row?.value ?? null;
}

async function setMeta(key: string, value: string): Promise<void> {
  await db.meta.upsert({ where: { key }, update: { value }, create: { key, value } });
}

/** يدفع كل أحداث الطابور المعلّقة إلى الخادم (idempotent). */
export async function pushPending(): Promise<{ pushed: number; failed: number }> {
  const queue = await db.syncQueueItem.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    take: 100,
  });
  if (queue.length === 0) return { pushed: 0, failed: 0 };

  const events = queue.map((q) => JSON.parse(q.payload));
  const res = await fetch(`${apiBaseUrl}/sync/push`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader },
    body: JSON.stringify({ events }),
  });
  if (!res.ok) throw new Error(`فشل الدفع: ${res.status}`);

  const data = (await res.json()) as {
    results: Array<{ clientEventId: string; status: string }>;
  };

  let pushed = 0;
  let failed = 0;
  for (const r of data.results) {
    if (r.status === "ok" || r.status === "duplicate") {
      await db.syncQueueItem.update({
        where: { clientEventId: r.clientEventId },
        data: { status: "SYNCED" },
      });
      await db.localSale.updateMany({
        where: { clientEventId: r.clientEventId },
        data: { synced: true },
      });
      pushed++;
    } else {
      await db.syncQueueItem.update({
        where: { clientEventId: r.clientEventId },
        data: { status: "FAILED", attempts: { increment: 1 }, lastError: "rejected" },
      });
      failed++;
    }
  }
  return { pushed, failed };
}

/** يسحب تحديثات المنتجات من الخادم ويحدّث المرآة المحلية. */
export async function pullProducts(): Promise<{ updated: number }> {
  const since = await getMeta("lastPullAt");
  const url = `${apiBaseUrl}/sync/pull${since ? `?since=${encodeURIComponent(since)}` : ""}`;
  const res = await fetch(url, { headers: authHeader });
  if (!res.ok) throw new Error(`فشل السحب: ${res.status}`);

  const data = (await res.json()) as {
    serverTime: string;
    products: Array<{
      id: string;
      nameAr: string;
      sku: string;
      salePrice: number;
      quantity: number;
      minQuantity: number;
      isOnline: boolean;
      updatedAt: string;
    }>;
    users?: Array<{
      id: string;
      name: string;
      email: string;
      passwordHash: string;
      role: string;
    }>;
    customers?: Array<{
      id: string;
      name: string;
      phone: string | null;
      address: string | null;
      balance: number;
    }>;
  };

  for (const p of data.products) {
    const fields = {
      nameAr: p.nameAr,
      sku: p.sku,
      salePrice: p.salePrice,
      quantity: p.quantity,
      minQuantity: p.minQuantity,
      isOnline: p.isOnline,
      updatedAt: p.updatedAt,
    };
    await db.localProduct.upsert({
      where: { id: p.id },
      update: fields,
      create: { id: p.id, ...fields },
    });
  }

  // مرآة المستخدمين لتسجيل الدخول الأوفلاين (FR-052)
  for (const u of data.users ?? []) {
    const fields = {
      name: u.name,
      email: u.email,
      passwordHash: u.passwordHash,
      role: u.role,
      updatedAt: data.serverTime,
    };
    await db.localUser.upsert({
      where: { id: u.id },
      update: fields,
      create: { id: u.id, ...fields },
    });
  }

  // مرآة الزبائن لبحث/إكمال نقطة البيع دون اتصال — تُسحَب كاملة كل دورة (سحب كامل)
  if (data.customers) {
    const ids = new Set(data.customers.map((c) => c.id));
    for (const c of data.customers) {
      const fields = {
        name: c.name,
        phone: c.phone,
        address: c.address,
        balance: c.balance,
        updatedAt: data.serverTime,
      };
      await db.localCustomer.upsert({
        where: { id: c.id },
        update: fields,
        create: { id: c.id, ...fields },
      });
    }
    // إزالة الزبائن المحذوفين على الخادم من المرآة المحلية (السحب كامل ⇒ التوفيق آمن)
    await db.localCustomer.deleteMany({ where: { id: { notIn: [...ids] } } });
  }

  await setMeta("lastPullAt", data.serverTime);
  return { updated: data.products.length };
}

/** دورة مزامنة كاملة: دفع ثم سحب. تُرجع الحالة، ولا ترمي عند انقطاع الشبكة. */
export async function syncNow(): Promise<SyncStatus> {
  let online = true;
  try {
    await pushPending();
    await pullProducts();
  } catch {
    online = false;
  }
  return getSyncStatus(online);
}

export async function getSyncStatus(online = true): Promise<SyncStatus> {
  const pending = await db.syncQueueItem.count({ where: { status: "PENDING" } });
  const lastPullAt = await getMeta("lastPullAt");
  return { pending, lastPullAt, online };
}

let timer: NodeJS.Timeout | null = null;

/** يبدأ مزامنة دورية كل 30 ثانية. */
export function startSyncLoop(): void {
  if (timer) return;
  void syncNow();
  timer = setInterval(() => void syncNow(), 30_000);
}
