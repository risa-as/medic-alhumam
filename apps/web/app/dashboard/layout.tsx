import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getStoreSetting } from "@/lib/settings";
import { DashboardShell } from "@/components/DashboardShell";

const NAV_ALL = [
  { href: "/dashboard",           label: "الرئيسية",       icon: "home",       roles: ["ADMIN"] },
  { href: "/dashboard/inventory", label: "المخزون",        icon: "inventory",  roles: ["ADMIN", "CASHIER"] },
  { href: "/dashboard/batches",   label: "الدفعات",        icon: "batches",    roles: ["ADMIN"] },
  { href: "/dashboard/categories", label: "الفئات",        icon: "categories", roles: ["ADMIN"] },
  { href: "/dashboard/orders",    label: "الطلبات",        icon: "orders",     roles: ["ADMIN", "CASHIER"] },
  { href: "/dashboard/sales",     label: "الفواتير",       icon: "sales",      roles: ["ADMIN", "CASHIER"] },
  { href: "/dashboard/debts",     label: "دفتر الديون",   icon: "debts",      roles: ["ADMIN"] },
  { href: "/dashboard/expenses",  label: "المصروفات",     icon: "expenses",   roles: ["ADMIN"] },
  { href: "/dashboard/customers", label: "الزبائن",        icon: "customers",  roles: ["ADMIN"] },
  { href: "/dashboard/reports",   label: "التقارير",       icon: "reports",    roles: ["ADMIN"] },
  { href: "/dashboard/users",     label: "المستخدمون",     icon: "users",      roles: ["ADMIN"] },
  { href: "/dashboard/settings",  label: "الإعدادات",      icon: "settings",   roles: ["ADMIN"] },
  { href: "/dashboard/profile",   label: "الملف الشخصي",  icon: "profile",    roles: ["ADMIN", "CASHIER"] },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { storeName } = await getStoreSetting();
  const role     = (session.user as { role?: string }).role ?? "CASHIER";
  const name     = session.user.name ?? "مستخدم";
  const initials = name.slice(0, 2);
  const nav      = NAV_ALL.filter((n) => n.roles.includes(role))
    .map(({ href, label, icon }) => ({ href, label, icon }));

  return (
    <DashboardShell
      storeName={storeName}
      role={role}
      name={name}
      initials={initials}
      nav={nav}
    >
      {children}
    </DashboardShell>
  );
}
