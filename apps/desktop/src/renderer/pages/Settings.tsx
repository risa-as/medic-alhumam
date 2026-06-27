import { useEffect, useState, useCallback, type ReactNode } from "react";
import {
  Check, X, Eye, EyeOff, Timer, Package, AlertTriangle, PlugZap, Save, RefreshCw,
  Hourglass, Mail, KeyRound, Tag, Settings as SettingsIcon, Monitor, Database, FolderOpen, Info,
} from "lucide-react";
import { PageHeader, Btn } from "../components/ui";
import type {
  ConnectionTestResult,
  AppInfo,
  SyncStatus,
  SessionUser,
} from "../types";

/* ── وقت مضى ── */
function timeAgo(iso: string | null): string {
  if (!iso) return "لم تتم بعد";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "منذ لحظات";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  return new Date(iso).toLocaleDateString("ar-IQ");
}

const PLATFORM_LABEL: Record<string, string> = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux",
};

/* ══════════════════════════════════════
   صف معلومة (تسمية ↔ قيمة)
══════════════════════════════════════ */
function InfoRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "9px 0",
        borderBottom: "1px solid var(--color-border-light)",
      }}
    >
      <span
        style={{
          fontSize: 12.5,
          color: "var(--color-text-secondary)",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <span style={{ color: "var(--color-text-secondary)", display: "inline-flex" }}>{icon}</span>
        {label}
      </span>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--color-text)" }}>
        {children}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════
   صف نتيجة تحقّق (✓ / ✗)
══════════════════════════════════════ */
function CheckRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 0" }}>
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 800,
          color: "#fff",
          background: ok ? "var(--color-success)" : "var(--color-danger)",
        }}
      >
        {ok ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
      </span>
      <span style={{ fontSize: 12.5, color: "var(--color-text-secondary)", fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
}

export function Settings() {
  /* إعدادات الاتصال */
  const [serverUrl, setServerUrl] = useState("");
  const [syncSecret, setSyncSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* التحقق من الاتصال */
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);

  /* الحالة الحيّة */
  const [sync, setSync] = useState<SyncStatus | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);

  const refreshLive = useCallback(async () => {
    const [s, stats] = await Promise.all([
      window.medic.syncStatus(),
      window.medic.getDashboardStats(),
    ]);
    setSync(s);
    setTotalProducts(stats.totalProducts);
  }, []);

  useEffect(() => {
    window.medic
      .getLocalSettings()
      .then((cfg) => {
        setServerUrl(cfg.serverUrl ?? "");
        setSyncSecret(cfg.syncSecret ?? "");
      })
      .catch(() => setErr("تعذّر تحميل الإعدادات المحلية"));

    window.medic.currentUser().then(setUser).catch(() => {});
    window.medic.appInfo().then(setAppInfo).catch(() => {});
    void refreshLive();
  }, [refreshLive]);

  /* أي تعديل على بيانات الاتصال يُبطل نتيجة التحقق السابقة */
  function onConnChange(setter: (v: string) => void, v: string) {
    setter(v);
    setTestResult(null);
    setSaved(false);
  }

  async function handleTest() {
    if (!serverUrl.trim()) {
      setErr("أدخل عنوان الخادم أولًا");
      return;
    }
    setErr(null);
    setTesting(true);
    setTestResult(null);
    try {
      const res = await window.medic.testConnection(serverUrl, syncSecret);
      setTestResult(res);
    } catch {
      setErr("تعذّر تنفيذ التحقق");
    } finally {
      setTesting(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await window.medic.saveLocalSettings({ serverUrl, syncSecret });
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch {
      setErr("تعذّر حفظ الإعدادات");
    } finally {
      setLoading(false);
    }
  }

  async function handleSyncNow() {
    setSyncing(true);
    const s = await window.medic.syncNow();
    setSync(s);
    await refreshLive();
    setSyncing(false);
  }

  const isOnline = sync?.online !== false;
  const pending = sync?.pending ?? 0;

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <PageHeader
        title="الإعدادات والتحقق"
        subtitle="إدارة الاتصال بالخادم المركزي والتحقق منه ومتابعة حالة المزامنة"
      />

      {err && <div className="alert alert-danger">{err}</div>}
      {saved && (
        <div className="alert alert-success" style={{ marginBottom: 18 }}>
          <Check size={15} strokeWidth={3} style={{ flexShrink: 0 }} />
          <span>تم حفظ الإعدادات — ستُطبَّق عند إعادة تشغيل التطبيق</span>
        </div>
      )}

      {/* ═══════════ اتصال الخادم + التحقق ═══════════ */}
      <form onSubmit={handleSave}>
        <div className="surface" style={{ marginBottom: 20 }}>
          <p className="surface-title">اتصال الخادم المركزي</p>

          <div className="form-group" style={{ marginBottom: 18 }}>
            <label className="form-label">عنوان الخادم (Server URL)</label>
            <input
              value={serverUrl}
              onChange={(e) => onConnChange(setServerUrl, e.target.value)}
              placeholder="https://your-server.com"
              className="input-field"
              dir="ltr"
              style={{ textAlign: "left" }}
            />
            <p className="form-hint">رابط خادم Next.js المركزي — مثال: https://medic.vercel.app</p>
          </div>

          <div className="form-group">
            <label
              className="form-label"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <span>مفتاح المزامنة (Sync Secret)</span>
              <button
                type="button"
                onClick={() => setShowSecret((s) => !s)}
                style={{
                  border: "none",
                  background: "none",
                  color: "var(--color-primary)",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: 0,
                }}
              >
                {showSecret
                  ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><EyeOff size={12} /> إخفاء</span>
                  : <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Eye size={12} /> إظهار</span>}
              </button>
            </label>
            <input
              type={showSecret ? "text" : "password"}
              value={syncSecret}
              onChange={(e) => onConnChange(setSyncSecret, e.target.value)}
              placeholder="••••••••••••••••"
              className="input-field"
              dir="ltr"
              style={{ textAlign: "left" }}
            />
            <p className="form-hint">يجب أن يطابق قيمة SYNC_SECRET المضبوطة على الخادم</p>
          </div>

          {/* ── نتيجة التحقق ── */}
          {testResult && (
            <div
              style={{
                marginTop: 18,
                background: "var(--color-surface-2)",
                border: `1px solid ${
                  testResult.authorized ? "#A7F3D0" : "var(--color-border)"
                }`,
                borderRadius: "var(--radius-lg)",
                padding: "14px 16px",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--color-text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 10,
                }}
              >
                نتيجة التحقق
              </p>
              <CheckRow ok={testResult.reachable} label="الوصول إلى الخادم" />
              <CheckRow ok={testResult.authorized} label="صحّة مفتاح المزامنة" />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: "1px solid var(--color-border-light)",
                  fontSize: 12,
                  color: "var(--color-text-muted)",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Timer size={13} /> زمن الاستجابة: {testResult.latencyMs} ملّي ثانية</span>
                {testResult.authorized && (
                  <span style={{ color: "var(--color-success)", fontWeight: 600 }}>
                    <Package size={13} style={{ verticalAlign: "-2px" }} /> جاهز للمزامنة: {testResult.productCount} منتج · {testResult.userCount} مستخدم
                  </span>
                )}
              </div>

              {testResult.error && (
                <p
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: "var(--color-danger)",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <AlertTriangle size={14} style={{ flexShrink: 0 }} /> {testResult.error}
                </p>
              )}
            </div>
          )}

          {/* ── أزرار التحقق والحفظ ── */}
          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            <Btn
              type="button"
              variant="secondary"
              size="md"
              loading={testing}
              loadingText="جارٍ التحقق..."
              onClick={handleTest}
            >
              <PlugZap size={15} /> التحقق من الاتصال
            </Btn>
            <Btn
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              loadingText="جارٍ الحفظ..."
            >
              <Save size={15} /> حفظ الإعدادات
            </Btn>
          </div>
        </div>
      </form>

      {/* ═══════════ شبكة: حالة المزامنة + الحساب ═══════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* ── حالة المزامنة ── */}
        <div className="surface">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <p className="surface-title" style={{ border: "none", padding: 0, margin: 0 }}>
              حالة المزامنة
            </p>
            <span
              className={`badge ${isOnline ? "badge-success" : "badge-danger"}`}
            >
              {isOnline ? "متصل" : "غير متصل"}
            </span>
          </div>

          <InfoRow icon={<RefreshCw size={14} />} label="آخر مزامنة">
            {timeAgo(sync?.lastPullAt ?? null)}
          </InfoRow>
          <InfoRow icon={<Hourglass size={14} />} label="فواتير بانتظار المزامنة">
            <span style={{ color: pending > 0 ? "var(--color-warning)" : "var(--color-success)" }}>
              {pending > 0 ? `${pending} معلّقة` : "لا يوجد"}
            </span>
          </InfoRow>
          <InfoRow icon={<Package size={14} />} label="إجمالي المنتجات المحلية">
            {totalProducts ?? "—"}
          </InfoRow>

          <button
            onClick={handleSyncNow}
            disabled={syncing}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "9px 14px",
              borderRadius: "var(--radius)",
              border: "1.5px solid var(--color-border)",
              background: "var(--color-surface)",
              fontSize: 12.5,
              fontWeight: 600,
              color: "var(--color-text-secondary)",
              cursor: syncing ? "default" : "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              boxShadow: "var(--shadow-xs)",
            }}
          >
            {syncing ? (
              <>
                <span className="spinner spinner-dark" style={{ width: 12, height: 12 }} /> جارٍ
                المزامنة...
              </>
            ) : (
              <>
                <RefreshCw size={14} /> مزامنة الآن
              </>
            )}
          </button>
        </div>

        {/* ── الحساب الحالي ── */}
        <div className="surface">
          <p className="surface-title">الحساب الحالي</p>

          {user ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "var(--radius-lg)",
                    background: "var(--color-primary)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 17,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {user.name.slice(0, 2)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)" }}>
                    {user.name}
                  </p>
                  <span
                    className={`badge ${user.role === "ADMIN" ? "badge-info" : "badge-success"}`}
                    style={{ marginTop: 4 }}
                  >
                    {user.role === "ADMIN" ? "مدير النظام" : "موظف"}
                  </span>
                </div>
              </div>

              <InfoRow icon={<Mail size={14} />} label="البريد الإلكتروني">
                <span dir="ltr">{user.email}</span>
              </InfoRow>
              <InfoRow icon={<KeyRound size={14} />} label="نوع الجلسة">
                {user.token ? "موثّقة أونلاين (JWT)" : "أوفلاين محلية"}
              </InfoRow>
            </>
          ) : (
            <p style={{ fontSize: 12.5, color: "var(--color-text-muted)" }}>
              لا توجد جلسة نشطة
            </p>
          )}
        </div>
      </div>

      {/* ═══════════ معلومات التطبيق ═══════════ */}
      <div className="surface" style={{ marginBottom: 20 }}>
        <p className="surface-title">معلومات التطبيق</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
          <InfoRow icon={<Tag size={14} />} label="إصدار التطبيق">
            {appInfo?.version ?? "—"}
          </InfoRow>
          <InfoRow icon={<SettingsIcon size={14} />} label="إصدار Electron">
            {appInfo?.electron ?? "—"}
          </InfoRow>
          <InfoRow icon={<Monitor size={14} />} label="نظام التشغيل">
            {appInfo ? PLATFORM_LABEL[appInfo.platform] ?? appInfo.platform : "—"}
          </InfoRow>
          <InfoRow icon={<Database size={14} />} label="وضع التشغيل">
            Offline First
          </InfoRow>
        </div>
        {appInfo?.userDataPath && (
          <p
            className="form-hint"
            dir="ltr"
            style={{ marginTop: 12, textAlign: "left", wordBreak: "break-all" }}
          >
            <FolderOpen size={13} style={{ verticalAlign: "-2px" }} /> {appInfo.userDataPath}
          </p>
        )}
      </div>

      {/* ملاحظة */}
      <div
        className="alert alert-info"
        style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
      >
        <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ lineHeight: 1.6 }}>
          بعد تغيير إعدادات الاتصال، أعد تشغيل التطبيق ثم شغّل المزامنة لتحديث بيانات المنتجات
          والمستخدمين. استخدم زر <strong>«التحقق من الاتصال»</strong> للتأكد من صحّة العنوان والمفتاح
          قبل الحفظ.
        </span>
      </div>
    </div>
  );
}
