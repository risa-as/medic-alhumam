import { useEffect, useState, useCallback, type ReactNode } from "react";
import {
  Hand, Calendar, RefreshCw, Wallet, BarChart3, Package, Cloud, CloudOff,
  CreditCard, Check, ChevronLeft, Plus, Receipt, ShoppingCart, NotebookPen,
  Globe, Hourglass, Stethoscope,
} from "lucide-react";
import type { DashboardStats, RecentSaleRow, SessionUser } from "../types";

type Page = "home" | "pos" | "sales" | "inventory" | "debts" | "settings";

const fmt    = (n: number) => n.toLocaleString("ar-IQ");
const fmtIQD = (n: number) => `${n.toLocaleString("ar-IQ")} د.ع`;

/* ── وقت الترحيب ── */
function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "صباح الخير";
  if (h < 17) return "مساء الخير";
  return "مساء النور";
}

/* ── تنسيق التاريخ ── */
function todayLabel(): string {
  return new Date().toLocaleDateString("ar-IQ", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

/* ── وقت مضى ── */
function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)  return "منذ لحظات";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  return new Date(iso).toLocaleDateString("ar-IQ");
}

/* ══════════════════════════════════════
   KPI Card
══════════════════════════════════════ */
interface KpiCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  sub?: string;
  alert?: boolean;
  onClick?: () => void;
}

function KpiCard({ label, value, icon, color, sub, alert, onClick }: KpiCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        background: "var(--color-surface)",
        border: `1.5px solid ${alert ? `${color}55` : "var(--color-border)"}`,
        borderRadius: "var(--radius-xl)",
        padding: "20px 22px",
        boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: hovered && onClick ? "translateY(-3px)" : "translateY(0)",
        transition: "all 200ms cubic-bezier(0.4,0,0.2,1)",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* خط ملوّن علوي */}
      <div style={{
        position: "absolute", top: 0, right: 0, left: 0, height: 3,
        background: `linear-gradient(90deg, ${color}, ${color}88)`,
        borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            {label}
          </p>
          <p style={{ fontSize: 26, fontWeight: 800, color: "var(--color-text)", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: sub ? 6 : 0 }}>
            {value}
          </p>
          {sub && (
            <p style={{ fontSize: 11, color: alert ? color : "var(--color-text-muted)", marginTop: 4, fontWeight: alert ? 600 : 400 }}>
              {sub}
            </p>
          )}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: "var(--radius-lg)",
          background: `${color}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color, flexShrink: 0,
          border: `1.5px solid ${color}22`,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   بطاقة وصول سريع
══════════════════════════════════════ */
function QuickCard({
  icon, label, desc, color, badge, onClick,
}: { icon: ReactNode; label: string; desc: string; color: string; badge?: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        background: "var(--color-surface)",
        border: "1.5px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "16px 14px",
        cursor: "pointer",
        textAlign: "right",
        fontFamily: "inherit",
        width: "100%",
        boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-xs)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 180ms cubic-bezier(0.4,0,0.2,1)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "relative",
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: "var(--radius)",
        background: `${color}14`,
        border: `1.5px solid ${color}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color, flexShrink: 0,
        transition: "transform 180ms",
        transform: hovered ? "scale(1.1)" : "scale(1)",
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{desc}</p>
      </div>
      {badge != null && badge > 0 && (
        <span style={{
          background: color, color: "#fff",
          borderRadius: 5, padding: "2px 7px",
          fontSize: 10, fontWeight: 700, flexShrink: 0,
        }}>{badge}</span>
      )}
      <ChevronLeft size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
    </button>
  );
}

/* ══════════════════════════════════════
   سطر فاتورة أخيرة
══════════════════════════════════════ */
function SaleRow({ sale }: { sale: RecentSaleRow }) {
  const isToday = new Date(sale.createdAt).toDateString() === new Date().toDateString();
  const ptLabel: Record<string, string> = { CASH: "نقدي", CREDIT: "آجل", PARTIAL: "جزئي" };

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "11px 0",
      borderBottom: "1px solid var(--color-border-light)",
    }}>
      {/* أيقونة */}
      <div style={{
        width: 34, height: 34, borderRadius: "var(--radius)",
        background: sale.remaining > 0 ? "var(--color-warning-light)" : "var(--color-success-light)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, flexShrink: 0,
      }}>
        {sale.remaining > 0 ? <CreditCard size={15} style={{ color: "var(--color-warning)" }} /> : <Check size={15} strokeWidth={3} style={{ color: "var(--color-success)" }} />}
      </div>

      {/* تفاصيل */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text)", fontFamily: "monospace" }}>
            {sale.invoiceNo}
          </span>
          {isToday && (
            <span style={{ fontSize: 9, fontWeight: 600, background: "var(--color-primary-light)", color: "var(--color-primary)", padding: "1px 6px", borderRadius: 5 }}>
              اليوم
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
            {sale.customerName ?? "زبون عام"}
          </span>
          <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>·</span>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
            {ptLabel[sale.paymentType] ?? sale.paymentType}
          </span>
        </div>
      </div>

      {/* المبلغ والوقت */}
      <div style={{ textAlign: "left", flexShrink: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)", marginBottom: 2 }}>
          {fmt(sale.total)}
        </p>
        <p style={{ fontSize: 10, color: "var(--color-text-muted)" }}>
          {timeAgo(sale.createdAt)}
        </p>
      </div>

      {/* badge مزامنة */}
      <div style={{
        width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
        background: sale.synced ? "#10B981" : "#F59E0B",
        boxShadow: sale.synced ? "0 0 4px rgba(16,185,129,0.5)" : "0 0 4px rgba(245,158,11,0.5)",
      }} />
    </div>
  );
}

/* ══════════════════════════════════════
   Skeleton Loader
══════════════════════════════════════ */
function Skeleton({ w = "100%", h = 20, r = 5 }: { w?: number | string; h?: number; r?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg, #F1F5F9 0%, #E2E8F0 50%, #F1F5F9 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s ease-in-out infinite",
    }} />
  );
}

/* ══════════════════════════════════════
   الصفحة الرئيسية
══════════════════════════════════════ */
interface HomeProps {
  user: SessionUser;
  setPage: (p: Page) => void;
  syncStatus: { pending: number; online: boolean };
}

export function Home({ user, setPage, syncStatus }: HomeProps) {
  const [stats, setStats]       = useState<DashboardStats | null>(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    const data = await window.medic.getDashboardStats();
    setStats(data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { void load(); }, []);

  /* تحديث تلقائي كل 30 ثانية */
  useEffect(() => {
    const t = setInterval(() => void load(), 30_000);
    return () => clearInterval(t);
  }, []);

  const isAdmin = user.role === "ADMIN";

  return (
    <div style={{ width: "100%" }}>

      {/* ══ شريط الترحيب ══ */}
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        marginBottom: 28, gap: 16,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h1 style={{
              fontSize: 26, fontWeight: 800, color: "var(--color-text)",
              letterSpacing: "-0.04em", lineHeight: 1,
            }}>
              {greeting()}، {user.name} <Hand size={22} style={{ color: "#F59E0B", verticalAlign: "-3px" }} />
            </h1>
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: isAdmin ? "var(--color-primary-light)" : "var(--color-success-light)",
              color: isAdmin ? "var(--color-primary)" : "var(--color-success)",
              padding: "3px 10px", borderRadius: 5,
              border: `1px solid ${isAdmin ? "var(--color-primary-mid)" : "#A7F3D0"}`,
            }}>
              {isAdmin ? "مدير النظام" : "موظف"}
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar size={14} />
            <span>{todayLabel()}</span>
          </p>
        </div>

        {/* زر تحديث */}
        <button
          onClick={() => void load(true)}
          disabled={refreshing}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: "var(--radius)",
            border: "1.5px solid var(--color-border)", background: "var(--color-surface)",
            fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)",
            cursor: "pointer", fontFamily: "inherit", transition: "all 150ms",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <span style={{
            display: "inline-block",
            animation: refreshing ? "spin 0.7s linear infinite" : "none",
          }}><RefreshCw size={14} /></span>
          {refreshing ? "جارٍ التحديث..." : "تحديث"}
        </button>
      </div>

      {/* ══ KPI Cards ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ background: "var(--color-surface)", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-xl)", padding: "20px 22px", boxShadow: "var(--shadow-sm)" }}>
              <Skeleton h={10} w="60%" r={4} />
              <div style={{ marginTop: 12 }}><Skeleton h={28} w="80%" r={6} /></div>
              <div style={{ marginTop: 8 }}><Skeleton h={10} w="50%" r={4} /></div>
            </div>
          ))
        ) : (
          <>
            <KpiCard
              label="مبيعات اليوم"
              value={fmtIQD(stats?.todayRevenue ?? 0)}
              icon={<Wallet size={22} />}
              color="#059669"
              sub={`${stats?.todayCount ?? 0} فاتورة`}
              onClick={() => setPage("sales")}
            />
            <KpiCard
              label="ربح اليوم"
              value={stats?.todayProfit != null ? fmtIQD(stats.todayProfit) : "—"}
              icon={<BarChart3 size={22} />}
              color="#7C3AED"
              sub={stats?.todayProfit != null ? "صافي بعد التكلفة (FEFO)" : "يتطلب اتصال (مدير)"}
              onClick={() => setPage("sales")}
            />
            <KpiCard
              label="تنبيهات المخزون"
              value={stats?.lowStockCount ?? 0}
              icon={<Package size={22} />}
              color="#D97706"
              sub={(stats?.lowStockCount ?? 0) > 0 ? "منتج تحت الحد" : "المخزون كافٍ"}
              alert={(stats?.lowStockCount ?? 0) > 0}
              onClick={() => setPage("inventory")}
            />
            <KpiCard
              label="بانتظار المزامنة"
              value={syncStatus.pending}
              icon={syncStatus.online ? <Cloud size={22} /> : <CloudOff size={22} />}
              color={syncStatus.pending > 0 ? "#F59E0B" : "#94A3B8"}
              sub={syncStatus.online ? "متصل بالخادم" : "وضع أوفلاين"}
              alert={syncStatus.pending > 0}
            />
          </>
        )}
      </div>

      {/* ══ المحتوى الرئيسي: عمودان ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

        {/* ── آخر الفواتير ── */}
        <div style={{
          background: "var(--color-surface)",
          border: "1.5px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          padding: "20px 22px",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)", letterSpacing: "-0.02em" }}>
                آخر الفواتير
              </h2>
              <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>أحدث عمليات البيع المسجّلة</p>
            </div>
            <button
              onClick={() => setPage("sales")}
              style={{
                fontSize: 11, fontWeight: 600, color: "var(--color-primary)",
                background: "var(--color-primary-light)", border: "none",
                padding: "5px 12px", borderRadius: 5, cursor: "pointer",
                fontFamily: "inherit", transition: "opacity 150ms",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>عرض الكل <ChevronLeft size={12} /></span>
            </button>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Skeleton w={34} h={34} r={8} />
                  <div style={{ flex: 1 }}>
                    <Skeleton h={12} w="60%" r={4} />
                    <div style={{ marginTop: 5 }}><Skeleton h={10} w="40%" r={4} /></div>
                  </div>
                  <Skeleton w={50} h={14} r={4} />
                </div>
              ))}
            </div>
          ) : stats?.recentSales.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 10, padding: "40px 0",
              color: "var(--color-text-muted)",
            }}>
              <Receipt size={40} strokeWidth={1.5} />
              <p style={{ fontSize: 13 }}>لا توجد فواتير بعد</p>
              <button
                onClick={() => setPage("pos")}
                style={{
                  padding: "7px 16px", borderRadius: "var(--radius)",
                  background: "var(--color-primary)", color: "#fff",
                  border: "none", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Plus size={14} /> ابدأ أول فاتورة</span>
              </button>
            </div>
          ) : (
            <div>
              {stats?.recentSales.map((s) => (
                <SaleRow key={s.id} sale={s} />
              ))}
              <div style={{ marginTop: 2, paddingTop: 12, display: "flex", alignItems: "center", gap: 16, fontSize: 11, color: "var(--color-text-muted)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
                  مزامَن
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F59E0B", display: "inline-block" }} />
                  بانتظار المزامنة
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── العمود الأيمن ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* وصول سريع */}
          <div style={{
            background: "var(--color-surface)",
            border: "1.5px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            padding: "18px 20px",
            boxShadow: "var(--shadow-sm)",
          }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)", marginBottom: 14, letterSpacing: "-0.02em" }}>
              وصول سريع
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <QuickCard
                icon={<ShoppingCart size={20} />} label="نقطة البيع" desc="فاتورة جديدة"
                color="#1A5276" onClick={() => setPage("pos")}
              />
              <QuickCard
                icon={<Package size={20} />} label="المخزون" desc="المنتجات والكميات"
                color="#D97706"
                badge={(stats?.lowStockCount ?? 0) > 0 ? stats!.lowStockCount : undefined}
                onClick={() => setPage("inventory")}
              />
              <QuickCard
                icon={<Receipt size={20} />} label="الفواتير" desc="سجل المبيعات"
                color="#059669" onClick={() => setPage("sales")}
              />
              {isAdmin && (
                <QuickCard
                  icon={<NotebookPen size={20} />} label="دفتر الديون" desc="متابعة الديون والسداد"
                  color="#7C3AED" onClick={() => setPage("debts")}
                />
              )}
            </div>
          </div>

          {/* حالة النظام */}
          <div style={{
            background: "var(--color-surface)",
            border: "1.5px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            padding: "18px 20px",
            boxShadow: "var(--shadow-sm)",
          }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)", marginBottom: 14, letterSpacing: "-0.02em" }}>
              حالة النظام
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

              {/* الاتصال */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Globe size={14} /> الاتصال بالخادم
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 4,
                  color: syncStatus.online ? "var(--color-success)" : "var(--color-danger)",
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: syncStatus.online ? "#10B981" : "#EF4444",
                    boxShadow: syncStatus.online ? "0 0 5px rgba(16,185,129,0.6)" : "0 0 5px rgba(239,68,68,0.6)",
                  }} />
                  {syncStatus.online ? "متصل" : "غير متصل"}
                </span>
              </div>

              {/* آخر مزامنة */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                  <RefreshCw size={14} /> آخر مزامنة
                </span>
                <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                  {loading ? "—" : stats?.lastPullAt ? timeAgo(stats.lastPullAt) : "لم تتم بعد"}
                </span>
              </div>

              {/* المنتجات */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Package size={14} /> إجمالي المنتجات
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text)" }}>
                  {loading ? "—" : fmt(stats?.totalProducts ?? 0)}
                </span>
              </div>

              {/* معلّق */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Hourglass size={14} /> فواتير معلّقة
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: syncStatus.pending > 0 ? "var(--color-warning)" : "var(--color-success)",
                }}>
                  {syncStatus.pending > 0 ? syncStatus.pending : "لا يوجد"}
                </span>
              </div>

              {/* فاصل */}
              <div style={{ borderTop: "1px solid var(--color-border-light)", margin: "2px 0" }} />

              {/* بطاقة الإصدار */}
              <div style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border-light)",
                borderRadius: "var(--radius)",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <Stethoscope size={16} style={{ color: "var(--color-primary)" }} />
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)" }}>المستلزمات الطبية</p>
                  <p style={{ fontSize: 10, color: "var(--color-text-muted)" }}>نسخة سطح المكتب — Offline First</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
