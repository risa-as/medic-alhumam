"use client";

import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { signOut } from "next-auth/react";
import { User, Lock, IdCard, AlertTriangle, Check, Eye, EyeOff, LogOut } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { Btn, InputField, StatusBadge } from "@/components/ui";

interface Me {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CASHIER";
  createdAt: string;
}

/* ════════════════════════════════════════
   حقل كلمة مرور مع زر إظهار/إخفاء
════════════════════════════════════════ */
interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}
const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ label, error, required, className = "", ...rest }, ref) {
    const [show, setShow] = useState(false);
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-txt-secondary">
          {label}
          {required && <span className="mr-0.5 text-state-danger">*</span>}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={show ? "text" : "password"}
            {...rest}
            className={
              "w-full rounded border bg-surface px-3 py-2 pl-10 text-sm text-txt outline-none " +
              "transition-colors duration-150 placeholder:text-txt-muted focus:border-primary " +
              (error ? "border-state-danger " : "border-border ") +
              className
            }
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "إخفاء" : "إظهار"}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded p-1 text-sm text-txt-muted transition-colors hover:text-txt"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="text-[11px] text-state-danger">{error}</p>}
      </div>
    );
  },
);

/* ════════════════════════════════════════
   مقياس قوّة كلمة المرور
════════════════════════════════════════ */
const STRENGTH_LABELS = ["ضعيفة جدًا", "ضعيفة", "متوسطة", "جيدة", "قوية"];
const STRENGTH_COLORS = ["#B91C1C", "#B91C1C", "#B45309", "#1D4ED8", "#1A7F5A"];
function strengthInfo(pw: string): { score: number; label: string; color: string } {
  let s = 0;
  if (pw) {
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Za-z]/.test(pw) && /\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
  }
  s = Math.min(s, 4);
  return { score: s, label: STRENGTH_LABELS[s]!, color: STRENGTH_COLORS[s]! };
}

/* ════════════════════════════════════════
   بطاقة قسم بترويسة موحّدة
════════════════════════════════════════ */
function SectionCard({
  icon, title, subtitle, children, tone = "#1A5276", toneBg = "#D6EAF8",
}: {
  icon: ReactNode; title: string; subtitle: string; children: ReactNode;
  tone?: string; toneBg?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface" style={{ boxShadow: "var(--shadow-sm)" }}>
      <div className="flex items-center gap-3 border-b border-border-light bg-app-bg px-5 py-3.5">
        <div className="flex h-9 w-9 items-center justify-center rounded" style={{ background: toneBg, color: tone }}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-txt">{title}</p>
          <p className="text-xs text-txt-muted">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════
   صفحة الملف الشخصي
════════════════════════════════════════ */
export default function ProfilePage() {
  const qc = useQueryClient();
  const [saved, setSaved]       = useState(false);
  const [pwSaved, setPwSaved]   = useState(false);
  const [copied, setCopied]     = useState<string | null>(null);

  const { data: me, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch<Me>("/me"),
  });

  /* ── نموذج الاسم ── */
  const nameForm = useForm<{ name: string }>({ values: { name: me?.name ?? "" } });

  const saveMut = useMutation({
    mutationFn: (data: { name: string }) =>
      apiFetch<Me>("/me", { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  /* ── نموذج كلمة المرور ── */
  const pwForm = useForm<{ currentPassword: string; newPassword: string; confirmPassword: string }>({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });
  const newPw = pwForm.watch("newPassword");
  const strength = strengthInfo(newPw ?? "");

  const pwMut = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      apiFetch<{ ok: boolean }>("/me/password", { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => {
      pwForm.reset();
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 3500);
    },
  });

  function copy(text: string, key: string) {
    void navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center gap-2 text-txt-muted">
        <span className="spinner spinner-dark" /> جارٍ التحميل...
      </div>
    );
  }

  const initials = (me?.name ?? "؟").split(" ").map((w) => w[0]).slice(0, 2).join("");
  const isAdmin  = me?.role === "ADMIN";
  const joinDate = me?.createdAt
    ? new Date(me.createdAt).toLocaleDateString("ar-IQ", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div className="mx-auto max-w-4xl pb-8">

      {/* ═══════════ بطاقة الهوية ═══════════ */}
      <div className="mb-5 overflow-hidden rounded-lg border border-border bg-surface" style={{ boxShadow: "var(--shadow-md)" }}>
        <div
          className="relative h-28"
          style={{ background: "linear-gradient(135deg, #0D2137 0%, #1A5276 55%, #2E86C1 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          />
        </div>

        <div className="px-6 pb-6 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3" style={{ marginTop: -44 }}>
            {/* الأفاتار */}
            <div className="flex items-end gap-4">
              <div className="relative" style={{ padding: 4, background: "#fff", borderRadius: 7, boxShadow: "0 4px 16px rgba(13,27,42,0.18)" }}>
                <div
                  style={{
                    width: 84, height: 84, borderRadius: 5,
                    background: "linear-gradient(135deg, #1A5276 0%, #2E86C1 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: 2,
                  }}
                >
                  {initials}
                </div>
                {/* نقطة الحالة */}
                <span
                  className="absolute h-4 w-4 rounded-full border-2 border-white"
                  style={{ background: "#1A7F5A", bottom: 6, left: 6 }}
                  title="نشط"
                />
              </div>
            </div>

            <div className="mb-1 flex items-center gap-2">
              <StatusBadge status={isAdmin ? "info" : "neutral"} label={isAdmin ? "مدير النظام" : "موظف"} />
            </div>
          </div>

          {/* الاسم والبريد */}
          <div className="mt-4">
            <h1 className="text-xl font-bold text-txt">{me?.name}</h1>
            <p className="mt-0.5 text-sm text-txt-secondary">{me?.email}</p>
          </div>

          {/* شريط الإحصائيات */}
          <div className="mt-5 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-lg border border-border" style={{ direction: "ltr" }}>
            {[
              { label: "الدور",          value: isAdmin ? "مدير النظام" : "موظف" },
              { label: "تاريخ الانضمام", value: joinDate },
              { label: "الحالة",         value: "نشط ●" },
            ].map((item) => (
              <div key={item.label} className="px-4 py-4 text-center" style={{ direction: "rtl" }}>
                <p className="text-[11px] text-txt-muted">{item.label}</p>
                <p className="mt-1 truncate text-sm font-semibold text-txt">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ القسمان الوظيفيان ═══════════ */}
      <div className="grid gap-5 md:grid-cols-2">

        {/* ── المعلومات الشخصية ── */}
        <SectionCard icon={<User className="h-[18px] w-[18px]" />} title="المعلومات الشخصية" subtitle="تعديل الاسم المعروض في النظام">
          <form onSubmit={nameForm.handleSubmit((v) => saveMut.mutate(v))} className="space-y-4 p-5">
            <InputField
              label="الاسم الكامل"
              required
              placeholder="أدخل اسمك..."
              error={nameForm.formState.errors.name?.message}
              {...nameForm.register("name", { required: "الاسم مطلوب" })}
            />

            <InputField label="البريد الإلكتروني" value={me?.email ?? ""} disabled readOnly />
            <p className="-mt-2 text-[11px] text-txt-muted">البريد والدور يُداران من قِبل المدير فقط.</p>

            {saveMut.isError && (
              <div className="flex items-center gap-1.5 rounded border border-state-danger-light bg-state-danger-light px-3 py-2 text-xs text-state-danger">
                <AlertTriangle className="h-4 w-4 shrink-0" /> {saveMut.error instanceof Error ? saveMut.error.message : "حدث خطأ"}
              </div>
            )}
            {saved && (
              <div className="flex items-center gap-1.5 rounded border border-green-200 bg-state-success-light px-3 py-2 text-xs text-state-success">
                <Check className="h-4 w-4 shrink-0" strokeWidth={3} /> تم حفظ الاسم بنجاح
              </div>
            )}

            <Btn type="submit" variant="primary" fullWidth loading={saveMut.isPending} loadingText="جارٍ الحفظ...">
              حفظ التغييرات
            </Btn>
          </form>
        </SectionCard>

        {/* ── الأمان: تغيير كلمة المرور ── */}
        <SectionCard icon={<Lock className="h-[18px] w-[18px]" />} title="الأمان" subtitle="تغيير كلمة المرور الخاصة بك" tone="#B45309" toneBg="#FEF3C7">
          <form
            onSubmit={pwForm.handleSubmit((v) =>
              pwMut.mutate({ currentPassword: v.currentPassword, newPassword: v.newPassword }),
            )}
            className="space-y-4 p-5"
          >
            <PasswordField
              label="كلمة المرور الحالية"
              required
              placeholder="••••••••"
              autoComplete="current-password"
              error={pwForm.formState.errors.currentPassword?.message}
              {...pwForm.register("currentPassword", { required: "كلمة المرور الحالية مطلوبة" })}
            />

            <div>
              <PasswordField
                label="كلمة المرور الجديدة"
                required
                placeholder="6 أحرف على الأقل"
                autoComplete="new-password"
                error={pwForm.formState.errors.newPassword?.message}
                {...pwForm.register("newPassword", {
                  required: "كلمة المرور الجديدة مطلوبة",
                  minLength: { value: 6, message: "6 أحرف على الأقل" },
                })}
              />
              {/* مقياس القوّة */}
              {newPw && (
                <div className="mt-2">
                  <div className="flex gap-1" style={{ direction: "ltr" }}>
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-colors"
                        style={{ background: i < strength.score ? strength.color : "#E2E8F0" }}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-[11px] font-medium" style={{ color: strength.color }}>
                    قوّة كلمة المرور: {strength.label}
                  </p>
                </div>
              )}
            </div>

            <PasswordField
              label="تأكيد كلمة المرور"
              required
              placeholder="أعد إدخال كلمة المرور"
              autoComplete="new-password"
              error={pwForm.formState.errors.confirmPassword?.message}
              {...pwForm.register("confirmPassword", {
                required: "تأكيد كلمة المرور مطلوب",
                validate: (v) => v === pwForm.getValues("newPassword") || "كلمتا المرور غير متطابقتين",
              })}
            />

            {pwMut.isError && (
              <div className="flex items-center gap-1.5 rounded border border-state-danger-light bg-state-danger-light px-3 py-2 text-xs text-state-danger">
                <AlertTriangle className="h-4 w-4 shrink-0" /> {pwMut.error instanceof Error ? pwMut.error.message : "حدث خطأ"}
              </div>
            )}
            {pwSaved && (
              <div className="flex items-center gap-1.5 rounded border border-green-200 bg-state-success-light px-3 py-2 text-xs text-state-success">
                <Check className="h-4 w-4 shrink-0" strokeWidth={3} /> تم تغيير كلمة المرور بنجاح
              </div>
            )}

            <Btn type="submit" variant="primary" fullWidth loading={pwMut.isPending} loadingText="جارٍ التحديث...">
              تحديث كلمة المرور
            </Btn>
          </form>
        </SectionCard>
      </div>

      {/* ═══════════ تفاصيل الحساب + الخروج ═══════════ */}
      <div className="mt-5">
        <SectionCard icon={<IdCard className="h-[18px] w-[18px]" />} title="تفاصيل الحساب" subtitle="معلومات للقراءة فقط" tone="#5A6A7E" toneBg="#EAF0F6">
          <div className="divide-y divide-border-light px-5">
            {/* معرّف الحساب مع نسخ */}
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-xs text-txt-secondary">معرّف الحساب</span>
              <div className="flex items-center gap-2">
                <span className="max-w-[180px] truncate font-mono text-xs text-txt" title={me?.id}>{me?.id}</span>
                <button
                  type="button"
                  onClick={() => me && copy(me.id, "id")}
                  className="rounded border border-border px-2 py-0.5 text-[11px] text-txt-secondary transition-colors hover:border-primary hover:text-primary"
                >
                  {copied === "id" ? <span className="inline-flex items-center gap-1"><Check className="h-3 w-3" strokeWidth={3} /> نُسخ</span> : "نسخ"}
                </button>
              </div>
            </div>
            {/* البريد مع نسخ */}
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-xs text-txt-secondary">البريد الإلكتروني</span>
              <div className="flex items-center gap-2">
                <span className="max-w-[180px] truncate text-xs font-medium text-txt">{me?.email}</span>
                <button
                  type="button"
                  onClick={() => me && copy(me.email, "email")}
                  className="rounded border border-border px-2 py-0.5 text-[11px] text-txt-secondary transition-colors hover:border-primary hover:text-primary"
                >
                  {copied === "email" ? <span className="inline-flex items-center gap-1"><Check className="h-3 w-3" strokeWidth={3} /> نُسخ</span> : "نسخ"}
                </button>
              </div>
            </div>
            {/* الدور */}
            <div className="flex items-center justify-between py-3">
              <span className="text-xs text-txt-secondary">الدور</span>
              <span className="text-sm font-medium text-txt">{isAdmin ? "مدير النظام" : "موظف"}</span>
            </div>
            {/* تاريخ الإنشاء */}
            <div className="flex items-center justify-between py-3">
              <span className="text-xs text-txt-secondary">تاريخ الإنشاء</span>
              <span className="text-sm font-medium text-txt">{joinDate}</span>
            </div>
          </div>

          {/* تسجيل الخروج */}
          <div className="flex items-center justify-between gap-3 border-t border-border-light bg-app-bg px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-txt">تسجيل الخروج</p>
              <p className="text-xs text-txt-muted">إنهاء الجلسة الحالية على هذا الجهاز</p>
            </div>
            <Btn variant="danger" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>
              <LogOut className="h-3.5 w-3.5" /> تسجيل الخروج
            </Btn>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
