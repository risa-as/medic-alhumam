import { useState } from "react";
import { Stethoscope, AlertTriangle } from "lucide-react";
import type { SessionUser } from "../types";

export function Login({ onLoggedIn }: { onLoggedIn: (user: SessionUser) => void }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await window.medic.login(email.trim(), password);
      onLoggedIn(user);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "تعذّر تسجيل الدخول";
      setError(msg.replace(/^Error:\s*/, "").replace(/.*Error invoking remote method '[^']+':\s*Error:\s*/, ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", background: "#0F172A", direction: "rtl",
      position: "relative", overflow: "hidden",
    }}>
      {/* خلفية ديكورية */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", top: "-20%", right: "-10%",
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(26,82,118,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", left: "-10%",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(46,110,150,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
      </div>

      <div style={{ width: 400, maxWidth: "calc(100vw - 32px)", position: "relative", zIndex: 1 }}>
        {/* البطاقة الرئيسية */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 5,
          overflow: "hidden",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        }}>
          {/* شريط التدرّج العلوي */}
          <div style={{ height: 3, background: "linear-gradient(90deg, #123A52 0%, #1A5276 50%, #4A90BC 100%)" }} />

          <div style={{ padding: "36px 36px 32px" }}>
            {/* الشعار */}
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{
                width: 64, height: 64,
                background: "linear-gradient(135deg, #123A52 0%, #2E6E96 100%)",
                borderRadius: 5,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", margin: "0 auto 16px",
                boxShadow: "0 8px 24px rgba(26,82,118,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
              }}>
                <Stethoscope size={30} />
              </div>
              <h1 style={{
                fontSize: 22, fontWeight: 800, color: "#F1F5F9",
                letterSpacing: "-0.04em", marginBottom: 6,
              }}>
                متجر المستلزمات الطبية
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                تسجيل دخول الموظف
              </p>
            </div>

            {/* الحقول */}
            <form onSubmit={submit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.02em" }}>
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    placeholder="example@medic.com"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1.5px solid rgba(255,255,255,0.1)",
                      borderRadius: 5,
                      padding: "11px 14px",
                      fontSize: 13,
                      color: "#F1F5F9",
                      outline: "none",
                      transition: "all 150ms",
                      fontFamily: "inherit",
                      width: "100%",
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = "rgba(26,82,118,0.6)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,82,118,0.15)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.02em" }}>
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1.5px solid rgba(255,255,255,0.1)",
                      borderRadius: 5,
                      padding: "11px 14px",
                      fontSize: 13,
                      color: "#F1F5F9",
                      outline: "none",
                      transition: "all 150ms",
                      fontFamily: "inherit",
                      width: "100%",
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = "rgba(26,82,118,0.6)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,82,118,0.15)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }}
                  />
                </div>
              </div>

              {error && (
                <div style={{
                  background: "rgba(220,38,38,0.12)",
                  border: "1px solid rgba(220,38,38,0.25)",
                  borderRadius: 5,
                  padding: "10px 14px",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontSize: 12,
                  color: "#FCA5A5",
                }}>
                  <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "13px 24px",
                  borderRadius: 5,
                  border: "none",
                  background: loading
                    ? "rgba(26,82,118,0.5)"
                    : "linear-gradient(135deg, #1A5276 0%, #2E6E96 100%)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  transition: "all 200ms",
                  boxShadow: loading ? "none" : "0 4px 14px rgba(26,82,118,0.45)",
                  letterSpacing: "-0.01em",
                }}
                onMouseOver={e => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(26,82,118,0.55)";
                  }
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = loading ? "none" : "0 4px 14px rgba(26,82,118,0.45)";
                }}
              >
                {loading && (
                  <span style={{
                    display: "inline-block", width: 14, height: 14,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.65s linear infinite",
                  }} />
                )}
                {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
              </button>
            </form>
          </div>

          {/* التذييل */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.2)",
            padding: "12px 36px",
            textAlign: "center",
          }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
              للمساعدة تواصل مع مدير النظام
            </p>
          </div>
        </div>

        {/* نص أسفل البطاقة */}
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
          نظام إدارة المتجر — نسخة سطح المكتب
        </p>
      </div>
    </div>
  );
}
