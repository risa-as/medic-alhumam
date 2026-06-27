import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  accentColor: string;
  icon?: ReactNode;
  sub?: string;
}

export function StatCard({ label, value, accentColor, icon, sub }: StatCardProps) {
  return (
    <div
      className="rounded-lg border border-border bg-surface p-5 shadow-sm"
      style={{ borderRight: `3px solid ${accentColor}` }}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="mb-1.5 text-xs text-txt-secondary">{label}</p>
          <p className="text-[22px] font-bold leading-none text-txt">{value}</p>
          {sub && <p className="mt-1 text-xs text-txt-muted">{sub}</p>}
        </div>
        {icon && (
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded"
            style={{ background: `${accentColor}18`, color: accentColor }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
