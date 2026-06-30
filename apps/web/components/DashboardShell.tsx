"use client";

import { useState } from "react";
import { Stethoscope, Menu, X } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { SidebarNav, type SidebarNavItem } from "@/components/SidebarNav";

/**
 * هيكل لوحة التحكم المتجاوب.
 * • الحاسبة (lg+): شريط جانبي ثابت بعرض 220px كالسابق.
 * • الجوال/التابلت (<lg): شريط علوي بزر همبرغر يفتح قائمة منزلقة من اليمين
 *   مع طبقة تعتيم، وتُغلق القائمة تلقائيًّا عند اختيار رابط.
 */
export function DashboardShell({
  storeName,
  role,
  name,
  initials,
  nav,
  children,
}: {
  storeName: string;
  role: string;
  name: string;
  initials: string;
  nav: SidebarNavItem[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const roleLabel = role === "ADMIN" ? "مدير النظام" : "موظف";

  return (
    <div className="flex min-h-screen" dir="rtl">
      {/* ═══ طبقة التعتيم (جوال فقط) ═══ */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* ═══ Sidebar / Drawer ═══ */}
      <aside
        className={[
          "fixed inset-y-0 right-0 z-50 flex w-[260px] flex-col shadow-xl transition-transform duration-300 ease-out",
          "lg:static lg:z-auto lg:w-[220px] lg:shrink-0 lg:translate-x-0 lg:shadow-none lg:transition-none",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        style={{ background: "var(--color-sidebar)" }}
      >
        {/* Brand */}
        <div
          className="flex items-start justify-between px-4 pb-4 pt-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="min-w-0">
            <div
              className="mb-2 flex h-8 w-8 items-center justify-center rounded text-white"
              style={{ background: "var(--color-primary)" }}
            >
              <Stethoscope className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </div>
            <p className="truncate text-[13px] font-bold leading-tight text-white">{storeName}</p>
            <p className="mt-0.5 text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
              لوحة التحكم
            </p>
          </div>
          {/* زر الإغلاق (جوال فقط) */}
          <button
            onClick={() => setOpen(false)}
            aria-label="إغلاق القائمة"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <SidebarNav items={nav} onNavigate={() => setOpen(false)} />
        </div>

        {/* User Section */}
        <div className="px-2 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
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
                {roleLabel}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ═══ العمود الرئيسي ═══ */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* الشريط العلوي (جوال/تابلت فقط) */}
        <header
          className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface px-4 py-2.5 lg:hidden"
        >
          <button
            onClick={() => setOpen(true)}
            aria-label="فتح القائمة"
            className="flex h-9 w-9 items-center justify-center rounded border border-border text-txt-secondary transition-colors hover:bg-app-bg hover:text-txt"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-white"
              style={{ background: "var(--color-primary)" }}
            >
              <Stethoscope className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <span className="truncate text-sm font-bold text-txt">{storeName}</span>
          </div>
        </header>

        {/* المحتوى */}
        <main
          className="flex-1 overflow-auto p-4 sm:p-6"
          style={{ background: "var(--color-bg)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
