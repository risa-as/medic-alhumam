"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutDashboard, BarChart3, Boxes, type LucideIcon } from "lucide-react";

const TABS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard/reports", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/dashboard/reports/financial", label: "الأرباح والخسائر", icon: BarChart3 },
  { href: "/dashboard/reports/inventory", label: "المخزون والركود", icon: Boxes },
];

export function ReportsNav() {
  const pathname = usePathname();
  const qs = useSearchParams().toString();

  return (
    <div className="mb-5 flex flex-wrap gap-1 border-b border-border">
      {TABS.map((t) => {
        const active = pathname === t.href;
        const Icon = t.icon;
        return (
          <Link
            key={t.href}
            href={qs ? `${t.href}?${qs}` : t.href}
            aria-current={active ? "page" : undefined}
            className={[
              "-mb-px inline-flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-txt-secondary hover:text-txt",
            ].join(" ")}
          >
            <Icon className="h-4 w-4" />
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
