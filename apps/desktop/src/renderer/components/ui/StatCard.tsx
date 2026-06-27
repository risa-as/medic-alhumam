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
    <div className="stat-card" style={{ borderRight: `3px solid ${accentColor}` }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p className="stat-card-label">{label}</p>
          <p className="stat-card-value">{value}</p>
          {sub && <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>{sub}</p>}
        </div>
        {icon && (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius)",
              background: `${accentColor}18`,
              color: accentColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
