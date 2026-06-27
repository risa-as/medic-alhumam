import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumb, actions }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumb && (
        <p className="mb-1 text-xs text-txt-muted">{breadcrumb}</p>
      )}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-txt">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-txt-secondary">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
