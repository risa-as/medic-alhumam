type BadgeStatus = "success" | "warning" | "info" | "danger" | "neutral";

interface StatusBadgeProps {
  status: BadgeStatus;
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`badge badge-${status}`}>{label}</span>
  );
}
