import { unstable_cache } from "next/cache";
import { prisma } from "@medic/database";

/**
 * قائمة الفئات مرتّبة بالاسم — مخزّنة مؤقتًا في Data Cache (تتغيّر نادرًا).
 * تُستخدم في layout المتجر وصفحة المنتجات، فتُقلّل استعلامات القاعدة على كل تنقّل
 * (مهم بشكل خاص مع قاعدة Neon البعيدة/serverless). يتجدّد كل 5 دقائق أو عبر revalidateTag("categories").
 */
export const getCategoriesCached = unstable_cache(
  async () => prisma.category.findMany({ orderBy: { nameAr: "asc" } }),
  ["storefront-categories"],
  { revalidate: 300, tags: ["categories"] },
);
