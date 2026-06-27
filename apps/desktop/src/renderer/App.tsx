import { useEffect, useState } from "react";
import {
  LayoutDashboard, ShoppingCart, ReceiptText, Package, Users, NotebookPen,
  Settings as SettingsIcon, Stethoscope, RefreshCw, LogOut, type LucideIcon,
} from "lucide-react";
import { Pos } from "./pages/Pos";
import { Sales } from "./pages/Sales";
import { Inventory } from "./pages/Inventory";
import { Debts } from "./pages/Debts";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Customers } from "./pages/Customers";
import type { SyncStatus, SessionUser } from "./types";
import "./styles.css";

type Page = "home" | "pos" | "sales" | "inventory" | "customers" | "debts" | "settings";

interface NavItem {
  key: Page;
  label: string;
  icon: LucideIcon;
  roles: Array<"ADMIN" | "CASHIER">;
}

const NAV: NavItem[] = [
  { key: "home",      label: "الرئيسية",    icon: LayoutDashboard, roles: ["ADMIN", "CASHIER"] },
  { key: "pos",       label: "نقطة البيع",  icon: ShoppingCart,    roles: ["ADMIN", "CASHIER"] },
  { key: "sales",     label: "الفواتير",    icon: ReceiptText,     roles: ["ADMIN", "CASHIER"] },
  { key: "inventory", label: "المخزون",     icon: Package,         roles: ["ADMIN", "CASHIER"] },
  { key: "customers", label: "الزبائن",      icon: Users,           roles: ["ADMIN", "CASHIER"] },
  { key: "debts",     label: "دفتر الديون", icon: NotebookPen,     roles: ["ADMIN"] },
  { key: "settings",  label: "الإعدادات",   icon: SettingsIcon,    roles: ["ADMIN", "CASHIER"] },
];

export function App() {
  const [user, setUser]               = useState<SessionUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [page, setPage]               = useState<Page>("pos");
  const [sync, setSync]               = useState<SyncStatus | null>(null);
  const [syncing, setSyncing]         = useState(false);

  async function refreshStatus() {
    setSync(await window.medic.syncStatus());
  }

  useEffect(() => {
    window.medic.currentUser()
      .then((u) => setUser(u))
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    if (!user) return;
    void refreshStatus();
    const t = setInterval(refreshStatus, 10_000);
    return () => clearInterval(t);
  }, [user]);

  if (!authChecked) {
    return (
      <div className="loading-center" style={{ direction: "rtl" }}>
        <span className="spinner spinner-dark" />
        جارٍ التحميل...
      </div>
    );
  }

  if (!user) return <Login onLoggedIn={(u) => setUser(u)} />;

  const nav        = NAV.filter((n) => n.roles.includes(user.role));
  const activePage = nav.map((n) => n.key).includes(page) ? page : "pos";
  const initials   = user.name.slice(0, 2);

  async function handleLogout() {
    await window.medic.logout();
    setUser(null);
    setPage("pos");
  }

  const isOnline  = sync?.online !== false;
  const pending   = sync?.pending ?? 0;

  return (
    <div className="app">
      {/* ═══════════ Sidebar ═══════════ */}
      <aside className="sidebar no-print">

        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon"><Stethoscope size={20} color="#fff" /></div>
          <p className="sidebar-brand-name">المستلزمات الطبية</p>
          <p className="sidebar-brand-sub">نظام إدارة المتجر</p>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="sidebar-section-label">القائمة الرئيسية</p>
          {nav.map((n) => (
            <button
              key={n.key}
              className={`sidebar-nav-item ${activePage === n.key ? "active" : ""}`}
              onClick={() => setPage(n.key)}
            >
              <span className="nav-icon"><n.icon size={17} /></span>
              {n.label}
              {n.key === "sales" && pending > 0 && (
                <span className="nav-badge">{pending}</span>
              )}
            </button>
          ))}
        </nav>

        {/* حالة الاتصال والمزامنة */}
        <div className="sidebar-sync">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                background: isOnline ? "#10B981" : "#EF4444",
                boxShadow: isOnline ? "0 0 6px rgba(16,185,129,0.6)" : "0 0 6px rgba(239,68,68,0.6)",
              }} />
              <span style={{ fontWeight: 600, color: isOnline ? "#6EE7B7" : "#FCA5A5" }}>
                {isOnline ? "متصل" : "غير متصل"}
              </span>
            </span>
            {pending > 0 && (
              <span style={{ fontSize: 10, color: "#FDE68A" }}>{pending} معلّق</span>
            )}
          </div>
          <button
            onClick={async () => {
              setSyncing(true);
              setSync(await window.medic.syncNow());
              setSyncing(false);
            }}
            disabled={syncing}
            style={{
              width: "100%", padding: "6px 10px", borderRadius: "var(--radius-sm)",
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 500, cursor: "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center",
              gap: 6, transition: "all 150ms",
            }}
          >
            {syncing ? (
              <><span className="spinner" style={{ width: 10, height: 10 }} /> جارٍ المزامنة...</>
            ) : (
              <><RefreshCw size={12} /> مزامنة الآن</>
            )}
          </button>
        </div>

        {/* User Section */}
        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <div className="sidebar-avatar">{initials}</div>
            <div style={{ minWidth: 0 }}>
              <p className="sidebar-user-name">{user.name}</p>
              <p className="sidebar-user-role">
                {user.role === "ADMIN" ? "مدير النظام" : "موظف"}
              </p>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={15} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* ═══════════ Main Content ═══════════ */}
      <main className="content">
        {activePage === "home"      && <Home user={user} setPage={setPage} syncStatus={{ pending, online: isOnline }} />}
        {activePage === "pos"       && <Pos />}
        {activePage === "sales"     && <Sales />}
        {activePage === "inventory" && <Inventory isAdmin={user.role === "ADMIN"} />}
        {activePage === "customers" && <Customers />}
        {activePage === "debts"     && <Debts />}
        {activePage === "settings"  && <Settings />}
      </main>
    </div>
  );
}

