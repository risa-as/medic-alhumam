type BadgeStatus = "success" | "warning" | "info" | "danger" | "neutral" | "primary";

const cls: Record<BadgeStatus, string> = {
  success: "bg-state-success-light text-state-success",
  warning: "bg-state-warning-light text-state-warning",
  info:    "bg-state-info-light text-state-info",
  danger:  "bg-state-danger-light text-state-danger",
  neutral: "bg-slate-100 text-slate-500",
  primary: "bg-primary-light text-primary",
};

interface StatusBadgeProps {
  status: BadgeStatus;
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold ${cls[status]}`}>
      {label}
    </span>
  );
}
