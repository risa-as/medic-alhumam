"use client";

import { useEffect, useState } from "react";
import { useUrlParams } from "./useUrlParams";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "var(--radius)",
  border: "1.5px solid #E2E8F0",
  fontSize: 13,
  color: "#0F172A",
  outline: "none",
  background: "#fff",
};

/** فلتر نطاق السعر — يحدّث minPrice/maxPrice في الـ URL. */
export function PriceFilter() {
  const { searchParams, setParams } = useUrlParams();
  const [min, setMin] = useState(searchParams.get("minPrice") ?? "");
  const [max, setMax] = useState(searchParams.get("maxPrice") ?? "");

  useEffect(() => {
    setMin(searchParams.get("minPrice") ?? "");
    setMax(searchParams.get("maxPrice") ?? "");
  }, [searchParams]);

  const active = !!(searchParams.get("minPrice") || searchParams.get("maxPrice"));

  function apply(e: React.FormEvent) {
    e.preventDefault();
    setParams({ minPrice: min || null, maxPrice: max || null }, { resetPage: true });
  }

  function clear() {
    setMin("");
    setMax("");
    setParams({ minPrice: null, maxPrice: null }, { resetPage: true });
  }

  return (
    <form onSubmit={apply} className="p-4" style={{ borderRadius: "var(--radius)", background: "#fff", border: "1px solid #E2E8F0" }}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold" style={{ color: "#0F172A" }}>نطاق السعر</p>
        {active && (
          <button type="button" onClick={clear} className="text-[11px] font-medium" style={{ color: "#E11D48" }}>
            مسح
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="من"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          style={inputStyle}
        />
        <span style={{ color: "#CBD5E1" }}>—</span>
        <input
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="إلى"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          style={inputStyle}
        />
      </div>
      <button
        type="submit"
        className="mt-3 w-full py-2 text-xs font-bold text-white transition-all"
        style={{ borderRadius: "var(--radius)", background: "linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%)" }}
      >
        تطبيق
      </button>
    </form>
  );
}
