import { redirect } from "next/navigation";
import { Stethoscope } from "lucide-react";
import { auth } from "@/lib/auth";
import { getStoreSetting } from "@/lib/settings";
import { LogoutButton } from "@/components/LogoutButton";
import { SidebarNav } from "@/components/SidebarNav";

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
  const nav      = NAV_ALL.filter((n) => n.roles.includes(role));

  return (
    <div className="flex min-h-screen" dir="rtl">
      {/* ═══ Sidebar ═══ */}
      <aside
        className="flex w-[220px] shrink-0 flex-col"
        style={{ background: "var(--color-sidebar)" }}
      >
        {/* Brand */}
        <div
          className="px-4 pb-4 pt-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="mb-2 flex h-8 w-8 items-center justify-center rounded text-white"
            style={{ background: "var(--color-primary)" }}
          >
            <Stethoscope className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </div>
          <p className="text-[13px] font-bold leading-tight text-white">
            {storeName}
          </p>
          <p className="mt-0.5 text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
            لوحة التحكم
          </p>
        </div>

        {/* Navigation */}
        <SidebarNav items={nav.map(({ href, label, icon }) => ({ href, label, icon }))} />

        {/* User Section */}
        <div
          className="px-2 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="mb-2 flex items-center gap-2 px-1">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-xs font-bold text-white"
              style={{ background: "var(--color-primary)" }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-white">{name}</p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                {role === "ADMIN" ? "مدير النظام" : "موظف"}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ═══ Main Content ═══ */}
      <main
        className="min-h-screen flex-1 overflow-auto p-6"
        style={{ background: "var(--color-bg)" }}
      >
        {children}
      </main>
    </div>
  );
}
