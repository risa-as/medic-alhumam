import { unstable_cache } from "next/cache";
import { prisma } from "@medic/database";

export const DEFAULT_STORE_NAME = "متجر المستلزمات الطبية";

/**
 * يقرأ إعدادات المتجر (الاسم/الشعار/العملة) من قاعدة البيانات لمكوّنات الخادم.
 * مخزّن مؤقتًا في Data Cache (عابر للطلبات) لأن layout المتجر يحتاجه على كل صفحة؛
 * يتجدّد كل 5 دقائق أو عبر revalidateTag("settings") بعد تحديث الإعدادات.
 */
export const getStoreSetting = unstable_cache(
  async () => {
    const s = await prisma.setting.findFirst().catch(() => null);
    return {
      storeName: s?.storeName?.trim() || DEFAULT_STORE_NAME,
      logoUrl: s?.logoUrl ?? null,
      currency: s?.currency ?? "IQD",
    };
  },
  ["store-setting"],
  { revalidate: 300, tags: ["settings"] },
);
