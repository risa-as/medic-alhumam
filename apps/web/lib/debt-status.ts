/** حالات الدين وفلاترها — مصدر موحّد تستخدمه صفحتا الديون والزبائن. */
export type BadgeKind = "danger" | "warning" | "success";

export const DEBT_STATUS: Record<string, { label: string; badge: BadgeKind }> = {
  OPEN:    { label: "مفتوح",  badge: "danger" },
  PARTIAL: { label: "جزئي",   badge: "warning" },
  PAID:    { label: "مسدّد",  badge: "success" },
};

export const DEBT_FILTERS = [
  { key: "",        label: "الكل" },
  { key: "OPEN",    label: "مفتوح" },
  { key: "PARTIAL", label: "جزئي" },
  { key: "PAID",    label: "مسدّد" },
];
