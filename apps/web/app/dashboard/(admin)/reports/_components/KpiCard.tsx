"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { deltaPct } from "./helpers";

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: ReactNode;
  /** القيمة الحالية والسابقة لإظهار شارة الفرق (▲▼). */
  current?: number;
  previous?: number;
  /** هل الارتفاع جيّد؟ (الإيراد/الربح نعم؛ الخصومات لا). */
  goodUp?: boolean;
}

export function KpiCard({ label, value, sub, color, icon, current, previous, goodUp = true }: KpiCardProps) {
  const delta = current != null && previous != null ? deltaPct(current, previous) : null;
  const up = delta != null && delta >= 0;
  const positive = delta == null ? false : up === goodUp;

  return (
    <div
      className="rounded-lg border border-border bg-surface p-5"
      style={{ borderRight: `3px solid ${color}`, boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs text-txt-muted">{label}</p>
          <p className="mt-1.5 text-xl font-bold text-txt">{value}</p>
          <div className="mt-1.5 flex items-center gap-2">
            {delta != null && (
              <span
                className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-bold ${
                  positive ? "bg-state-success-light text-state-success" : "bg-state-danger-light text-state-danger"
                }`}
              >
                {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(delta)}%
              </span>
            )}
            {sub && <span className="truncate text-xs text-txt-muted">{sub}</span>}
          </div>
        </div>
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded"
          style={{ background: `${color}18`, color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
