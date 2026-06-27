"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Stethoscope, AlertTriangle } from "lucide-react";

export function LoginForm({ storeName }: { storeName: string }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("بيانات الدخول غير صحيحة. تحقق من البريد وكلمة المرور.");
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-app-bg"
    >
      {/* البطاقة */}
      <div
        className="w-full max-w-[380px] overflow-hidden rounded-lg border border-border bg-surface"
        style={{ boxShadow: "0 4px 24px rgba(13,27,42,0.12)" }}
      >
        {/* الشريط العلوي الملوّن */}
        <div
          className="h-1.5 w-full"
          style={{
            background: "linear-gradient(90deg, #0D2137 0%, #1A5276 50%, #2E86C1 100%)",
          }}
        />

        <div className="px-8 pb-8 pt-7">
          {/* الشعار والعنوان */}
          <div className="mb-7 text-center">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg text-white"
              style={{ background: "linear-gradient(135deg, #1A5276 0%, #2E86C1 100%)" }}
            >
              <Stethoscope className="h-7 w-7" />
            </div>
            <h1 className="text-lg font-bold text-txt">
              {storeName}
            </h1>
            <p className="mt-1 text-xs text-txt-muted">
              تسجيل دخول الموظف
            </p>
          </div>

          {/* النموذج */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* البريد */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-txt-secondary">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="example@email.com"
                className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-txt outline-none transition-colors placeholder:text-txt-muted focus:border-primary"
              />
            </div>

            {/* كلمة المرور */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-txt-secondary">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-txt outline-none transition-colors placeholder:text-txt-muted focus:border-primary"
              />
            </div>

            {/* رسالة الخطأ */}
            {error && (
              <div className="flex items-start gap-2 rounded border border-state-danger-light bg-state-danger-light px-3 py-2.5 text-xs text-state-danger">
                <AlertTriangle className="mt-px h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* زر الدخول */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded py-2.5 text-sm font-semibold text-white transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                background: loading
                  ? "#2E86C1"
                  : "linear-gradient(135deg, #1A5276 0%, #2E86C1 100%)",
              }}
            >
              {loading && (
                <span
                  className="inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white"
                />
              )}
              {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>

        {/* التذييل */}
        <div className="border-t border-border bg-app-bg px-8 py-3 text-center">
          <p className="text-[11px] text-txt-muted">
            للمساعدة تواصل مع مدير النظام
          </p>
        </div>
      </div>
    </main>
  );
}
