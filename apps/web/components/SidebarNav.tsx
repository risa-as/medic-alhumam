"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Truck,
  Tags,
  ShoppingCart,
  ReceiptText,
  NotebookPen,
  Users,
  BarChart3,
  UserCog,
  Settings,
  IdCard,
  HandCoins,
  type LucideIcon,
} from "lucide-react";

/** مفاتيح أيقونات الشريط الجانبي → مكوّنات lucide. */
const NAV_ICONS: Record<string, LucideIcon> = {
  home:       LayoutDashboard,
  inventory:  Package,
  batches:    Truck,
  categories: Tags,
  orders:     ShoppingCart,
  sales:      ReceiptText,
  debts:      NotebookPen,
  expenses:   HandCoins,
  customers:  Users,
  reports:    BarChart3,
  users:      UserCog,
  settings:   Settings,
  profile:    IdCard,
};

export interface SidebarNavItem {
  href: string;
  label: string;
  /** مفتاح من NAV_ICONS. */
  icon: string;
}

/**
 * روابط الشريط الجانبي للوحة التحكم مع إبراز الصفحة النشطة.
 * عميل (client) لأنه يعتمد على usePathname لمعرفة المسار الحالي.
 * onNavigate: يُستدعى عند النقر على رابط (لإغلاق قائمة الجوال).
 */
export function SidebarNav({
  items,
  onNavigate,
}: {
  items: SidebarNavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    // الرئيسية تُطابَق تمامًا فقط (وإلا لطابقت كل المسارات تحت /dashboard)
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-2 py-3">
      {items.map((n) => {
        const active = isActive(n.href);
        const Icon = NAV_ICONS[n.icon];
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`sidebar-nav-link${active ? " active" : ""}`}
          >
            {Icon && <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />}
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
