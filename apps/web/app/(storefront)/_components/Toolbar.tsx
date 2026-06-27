"use client";

import { useUrlParams } from "./useUrlParams";

export const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "price_asc", label: "السعر: من الأقل" },
  { value: "price_desc", label: "السعر: من الأعلى" },
  { value: "name", label: "الاسم (أ – ي)" },
] as const;

/** شريط أدوات النتائج: عدد المنتجات + قائمة الفرز. */
export function Toolbar({ count }: { count: number }) {
  const { searchParams, setParams } = useUrlParams();
  const sort = searchParams.get("sort") ?? "newest";

  return (
    <div
      className="mb-5 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5"
      style={{ borderRadius: "var(--radius)", background: "#fff", border: "1px solid #E2E8F0" }}
    >
      <p className="text-sm" style={{ color: "#475569" }}>
        <span className="font-bold" style={{ color: "#0F172A" }}>{count.toLocaleString("ar-IQ")}</span> منتج
      </p>

      <label className="flex items-center gap-2 text-xs" style={{ color: "#94A3B8" }}>
        ترتيب حسب
        <select
          value={sort}
          onChange={(e) =>
            setParams({ sort: e.target.value === "newest" ? null : e.target.value }, { resetPage: true })
          }
          className="cursor-pointer py-1.5 pr-3 pl-7 text-xs font-semibold outline-none transition-colors"
          style={{ borderRadius: "var(--radius)", border: "1.5px solid #E2E8F0", background: "#F8FAFC", color: "#0F172A" }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
