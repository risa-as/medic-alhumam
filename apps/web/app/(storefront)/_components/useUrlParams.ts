"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type ParamValue = string | number | null | undefined;

/**
 * خطّاف موحّد لتحديث معاملات الـ URL (للبحث/الفرز/الفلتر/الترقيم) دون فقدان بقيّة المعاملات.
 * تمرير قيمة فارغة/`null` يحذف المعامل. `resetPage` يحذف `page` (عند تغيير فلتر).
 */
export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (
      updates: Record<string, ParamValue>,
      options?: { resetPage?: boolean; basePath?: string },
    ) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") params.delete(key);
        else params.set(key, String(value));
      }
      if (options?.resetPage) params.delete("page");
      const base = options?.basePath ?? pathname;
      const qs = params.toString();
      router.push(qs ? `${base}?${qs}` : base);
    },
    [router, pathname, searchParams],
  );

  return { searchParams, setParams };
}
