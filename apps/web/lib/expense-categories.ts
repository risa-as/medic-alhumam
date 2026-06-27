import { Building2, Users, Zap, Truck, Wrench, Megaphone, Bus, Tag, type LucideIcon } from "lucide-react";

/** فئات المصاريف — مصدر موحّد (تسمية + لون + أيقونة) يُطابق ExpenseCategory في المخطط/core. */
export const EXPENSE_CATEGORIES: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  RENT:        { label: "إيجار",    color: "#1D4ED8", icon: Building2 },
  SALARIES:    { label: "رواتب",    color: "#7C3AED", icon: Users },
  UTILITIES:   { label: "فواتير",   color: "#0EA5E9", icon: Zap },
  PURCHASES:   { label: "مشتريات",  color: "#B45309", icon: Truck },
  MAINTENANCE: { label: "صيانة",    color: "#0891B2", icon: Wrench },
  MARKETING:   { label: "تسويق",    color: "#DB2777", icon: Megaphone },
  TRANSPORT:   { label: "نقل",      color: "#65A30D", icon: Bus },
  OTHER:       { label: "أخرى",     color: "#64748B", icon: Tag },
};

export const EXPENSE_CATEGORY_OPTIONS = Object.entries(EXPENSE_CATEGORIES).map(
  ([value, v]) => ({ value, label: v.label }),
);

export const expenseLabel = (key: string) => EXPENSE_CATEGORIES[key]?.label ?? key;
export const expenseColor = (key: string) => EXPENSE_CATEGORIES[key]?.color ?? "#64748B";
