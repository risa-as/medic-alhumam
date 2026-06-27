"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Pencil, AlertTriangle, Check } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-store";
import { IRAQ_GOVERNORATES } from "@medic/ui";
import { apiFetch } from "@/lib/fetcher";
import type { CustomerSession } from "@medic/core";

const fmt = (n: number) => n.toLocaleString("ar-IQ");

interface FormValues {
  name: string;
  phone: string;
  governorate: string;
  address: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "var(--radius)",
  border: "1px solid #E2E8F0",
  fontSize: 13,
  color: "#0F172A",
  outline: "none",
  transition: "border-color 150ms",
  background: "#fff",
};

function FormField({
  label, required, error, children,
}: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#475569" }}>
        {label} {required && <span style={{ color: "#F87171" }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-[11px]" style={{ color: "#F87171" }}>{error}</p>
      )}
    </div>
  );
}

function OrderSummary({ items, total }: { items: CartItem[]; total: number }) {
  return (
    <div
      className="p-4 space-y-3"
      style={{ borderRadius: "var(--radius)", border: "1px solid #E2E8F0", background: "#F8FAFC" }}
    >
      <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>ملخص الطلب</p>
      <div className="space-y-1.5">
        {items.map((i) => (
          <div key={i.productId} className="flex justify-between text-xs" style={{ color: "#64748B" }}>
            <span>{i.nameAr} × {i.quantity}</span>
            <span>{fmt(i.salePrice * i.quantity)}</span>
          </div>
        ))}
      </div>
      <div
        className="flex justify-between border-t pt-2.5"
        style={{ borderColor: "#E2E8F0" }}
      >
        <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>الإجمالي</span>
        <span className="text-base font-bold" style={{ color: "var(--color-primary-hover)" }}>{fmt(total)} د.ع</span>
      </div>
    </div>
  );
}

export function CheckoutClient({ initialSession }: { initialSession: CustomerSession | null }) {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const [session] = useState<CustomerSession | null>(initialSession);
  const [editing, setEditing]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: session
      ? { name: session.name, phone: session.phone, governorate: session.governorate, address: session.address ?? "" }
      : { name: "", phone: "", governorate: "", address: "" },
  });

  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  async function submitOrder(values: FormValues) {
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/session/customer", {
        method: "POST",
        body: JSON.stringify({ name: values.name, phone: values.phone, governorate: values.governorate, address: values.address }),
      });
      const crypto = await import("crypto").catch(() => ({ randomUUID: () => String(Date.now()) }));
      const clientEventId = "randomUUID" in crypto ? (crypto as { randomUUID: () => string }).randomUUID() : String(Date.now());
      await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({
          clientEventId,
          customerName: values.name,
          customerPhone: values.phone,
          governorate: values.governorate,
          customerAddress: values.address || undefined,
          source: "WEBSITE",
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.salePrice,
            selectedAttributes: i.selectedAttributes,
          })),
        }),
      });
      clear();
      router.push("/order-success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر إرسال الطلب");
    } finally {
      setSubmitting(false);
    }
  }

  /* ─── عرض بيانات الزبون المحفوظة ─── */
  if (session && !editing) {
    return (
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-xl font-bold" style={{ color: "#0F172A" }}>تأكيد الطلب</h1>
        <div className="space-y-4">
          <OrderSummary items={items} total={total()} />

          <div
            className="p-4 space-y-3"
            style={{ borderRadius: "var(--radius)", border: "1px solid #E2E8F0", background: "#fff" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>بيانات التوصيل</p>
              <button
                className="text-xs font-medium transition-colors"
                style={{ color: "var(--color-primary)" }}
                onClick={() => setEditing(true)}
              >
                <span className="inline-flex items-center gap-1">تعديل <Pencil className="h-3 w-3" /></span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              {[
                { label: "الاسم", value: session.name },
                { label: "الهاتف", value: session.phone },
                { label: "المحافظة", value: session.governorate },
                ...(session.address ? [{ label: "العنوان", value: session.address }] : []),
              ].map((row) => (
                <div key={row.label} className="contents">
                  <span style={{ color: "#94A3B8" }}>{row.label}</span>
                  <span style={{ color: "#0F172A" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 text-sm"
              style={{ borderRadius: "var(--radius)", background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}
            >
              <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <button
            className="w-full py-3 text-sm font-bold text-white transition-all"
            style={{
              borderRadius: "var(--radius)",
              background: submitting ? "var(--color-primary-hover)" : "linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%)",
              boxShadow: submitting ? "none" : "0 4px 14px rgba(26,82,118,0.3)",
              opacity: submitting ? 0.8 : 1,
              cursor: submitting ? "wait" : "pointer",
            }}
            disabled={submitting}
            onClick={() =>
              submitOrder({
                name: session.name,
                phone: session.phone,
                governorate: session.governorate,
                address: session.address ?? "",
              })
            }
          >
            {submitting ? "جارٍ الإرسال..." : <span className="inline-flex items-center justify-center gap-1.5"><Check className="h-4 w-4" strokeWidth={3} /> تأكيد الطلب</span>}
          </button>
        </div>
      </div>
    );
  }

  /* ─── فورمة الإدخال ─── */
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-xl font-bold" style={{ color: "#0F172A" }}>تأكيد الطلب</h1>
      <div className="space-y-4">
        <OrderSummary items={items} total={total()} />

        <form
          onSubmit={handleSubmit(submitOrder)}
          className="p-5 space-y-4"
          style={{ borderRadius: "var(--radius)", border: "1px solid #E2E8F0", background: "#fff" }}
        >
          <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>بيانات التوصيل</p>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="الاسم الكامل" required error={errors.name?.message}>
              <input
                style={inputStyle}
                {...register("name", { required: "الاسم مطلوب" })}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--color-primary)"; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E2E8F0"; }}
              />
            </FormField>
            <FormField label="رقم الهاتف" required error={errors.phone?.message}>
              <input
                type="tel"
                style={inputStyle}
                {...register("phone", { required: "الهاتف مطلوب" })}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--color-primary)"; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E2E8F0"; }}
              />
            </FormField>
          </div>

          <FormField label="المحافظة" required error={errors.governorate?.message}>
            <select
              style={inputStyle}
              {...register("governorate", { required: "المحافظة مطلوبة" })}
              onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = "var(--color-primary)"; }}
              onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = "#E2E8F0"; }}
            >
              <option value="">اختر المحافظة...</option>
              {IRAQ_GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </FormField>

          <FormField label="العنوان التفصيلي">
            <textarea
              rows={2}
              style={{ ...inputStyle, resize: "none" }}
              placeholder="الحي، الشارع، رقم المنزل... (اختياري)"
              {...register("address")}
              onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--color-primary)"; }}
              onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#E2E8F0"; }}
            />
          </FormField>

          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 text-sm"
              style={{ borderRadius: "var(--radius)", background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}
            >
              <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-sm font-bold text-white transition-all"
            style={{
              borderRadius: "var(--radius)",
              background: "linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%)",
              opacity: submitting ? 0.8 : 1,
              cursor: submitting ? "wait" : "pointer",
            }}
          >
            {submitting ? "جارٍ الإرسال..." : <span className="inline-flex items-center justify-center gap-1.5"><Check className="h-4 w-4" strokeWidth={3} /> تأكيد الطلب</span>}
          </button>

          {session && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="w-full py-2 text-xs transition-colors"
              style={{ color: "#94A3B8" }}
            >
              إلغاء
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
