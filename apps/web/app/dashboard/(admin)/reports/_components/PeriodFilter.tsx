"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { todayISO, daysAgoISO, yesterdayISO, startOfWeekISO, startOfMonthISO } from "./helpers";

const PRESETS: { key: string; label: string; range: () => { from: string; to: string } }[] = [
  { key: "today",     label: "اليوم",        range: () => ({ from: todayISO(),        to: todayISO() }) },
  { key: "yesterday", label: "أمس",          range: () => ({ from: yesterdayISO(),    to: yesterdayISO() }) },
  { key: "week",      label: "هذا الأسبوع",  range: () => ({ from: startOfWeekISO(),  to: todayISO() }) },
  { key: "month",     label: "هذا الشهر",    range: () => ({ from: startOfMonthISO(), to: todayISO() }) },
];

/** فلتر الفترة المشترك — يتزامن مع معاملات الرابط ويُخفى في تبويب المخزون. */
export function PeriodFilter() {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();
  const [forceCustom, setForceCustom] = useState(false);

  // المخزون لقطة حالية وله ضوابطه الخاصة
  if (pathname.endsWith("/inventory")) return null;

  const from = sp.get("from") ?? daysAgoISO(30);
  const to = sp.get("to") ?? todayISO();

  function patch(next: Record<string, string>) {
    const p = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) p.set(k, v);
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }

  const activePreset = PRESETS.find((pr) => {
    const r = pr.range();
    return r.from === from && r.to === to;
  });
  const isCustom = forceCustom || !activePreset;

  return (
    <div className="mb-5 rounded-lg border border-border bg-surface p-4" style={{ boxShadow: "var(--shadow-sm)" }}>
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-txt-secondary">نطاق سريع</span>
          <div className="flex flex-wrap gap-1">
            {PRESETS.map((pr) => (
              <button
                key={pr.key}
                onClick={() => { setForceCustom(false); patch(pr.range()); }}
                className={[
                  "rounded border px-3 py-1.5 text-xs font-medium transition-all",
                  !isCustom && activePreset?.key === pr.key ? "border-primary bg-primary text-white" : "border-border text-txt-secondary hover:bg-app-bg",
                ].join(" ")}
              >
                {pr.label}
              </button>
            ))}
            <button
              onClick={() => setForceCustom(true)}
              className={[
                "rounded border px-3 py-1.5 text-xs font-medium transition-all",
                isCustom ? "border-primary bg-primary text-white" : "border-border text-txt-secondary hover:bg-app-bg",
              ].join(" ")}
            >
              مخصص
            </button>
          </div>
        </div>

        {isCustom && (
          <>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-end gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-txt-secondary">من</label>
                <input
                  type="date"
                  value={from}
                  max={to}
                  onChange={(e) => patch({ from: e.target.value })}
                  className="rounded border border-border px-3 py-1.5 text-sm text-txt outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-txt-secondary">إلى</label>
                <input
                  type="date"
                  value={to}
                  max={todayISO()}
                  onChange={(e) => patch({ to: e.target.value })}
                  className="rounded border border-border px-3 py-1.5 text-sm text-txt outline-none focus:border-primary"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
