"use client";

import { Clock } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * فلتر نطاق وقت يومي (مثلًا 8ص–4م) يُطبَّق على كل يوم ضمن المدى المختار.
 * يُخزَّن في معاملات الرابط fromTime/toTime (بصيغة HH:MM) فيتزامن مع بقية الفلاتر.
 */
export function TimeWindowFilter() {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  // يظهر في تبويب الأرباح والخسائر فقط (المكان الذي يُطبَّق فيه الفلتر).
  if (!pathname.endsWith("/financial")) return null;

  const fromTime = sp.get("fromTime") ?? "";
  const toTime = sp.get("toTime") ?? "";
  const enabled = !!(fromTime && toTime);

  function patch(next: Record<string, string | null>) {
    const p = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v == null || v === "") p.delete(k);
      else p.set(k, v);
    }
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }

  function toggle(on: boolean) {
    if (on) patch({ fromTime: fromTime || "08:00", toTime: toTime || "16:00" });
    else patch({ fromTime: null, toTime: null });
  }

  return (
    <div className="mb-5 rounded-lg border border-border bg-surface p-4" style={{ boxShadow: "var(--shadow-sm)" }}>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[var(--color-primary)]"
            checked={enabled}
            onChange={(e) => toggle(e.target.checked)}
          />
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-txt-secondary">
            <Clock className="h-4 w-4 text-primary" /> نطاق وقت يومي
          </span>
        </label>

        {enabled && (
          <>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-txt-secondary">من الساعة</label>
                <input
                  type="time"
                  value={fromTime}
                  onChange={(e) => patch({ fromTime: e.target.value })}
                  className="rounded border border-border px-3 py-1.5 text-sm text-txt outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-txt-secondary">إلى الساعة</label>
                <input
                  type="time"
                  value={toTime}
                  onChange={(e) => patch({ toTime: e.target.value })}
                  className="rounded border border-border px-3 py-1.5 text-sm text-txt outline-none focus:border-primary"
                />
              </div>
            </div>
            <span className="text-[11px] text-txt-muted">
              يُطبَّق على كل يوم ضمن المدى المختار (اليوم/أمس/الأسبوع/الشهر/مخصّص).
            </span>
          </>
        )}
      </div>
    </div>
  );
}
