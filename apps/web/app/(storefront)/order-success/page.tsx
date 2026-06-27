import Link from "next/link";
import { CheckCircle2, Check } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        {/* أيقونة النجاح */}
        <div
          className="flex h-20 w-20 items-center justify-center"
          style={{
            borderRadius: "var(--radius)",
            background: "linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-light) 100%)",
            border: "2px solid var(--color-primary-light)",
            color: "var(--color-primary)",
          }}
        >
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0F172A" }}>
            تم استلام طلبك!
          </h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "#64748B" }}>
            شكرًا لك على ثقتك بنا. تم تسجيل طلبك بنجاح وسيتواصل معك فريقنا قريبًا لتأكيد موعد التوصيل.
          </p>
        </div>

        {/* خطوات */}
        <div
          className="w-full space-y-2 p-4 text-right"
          style={{ borderRadius: "var(--radius)", background: "#F8FAFC", border: "1px solid #E2E8F0" }}
        >
          {[
            { step: "1", text: "تم استلام طلبك", done: true },
            { step: "2", text: "سيتصل بك فريقنا لتأكيد الطلب", done: false },
            { step: "3", text: "سيصلك المنتج في الموعد المحدد", done: false },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3">
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center text-xs font-bold"
                style={{
                  borderRadius: "var(--radius)",
                  background: item.done ? "var(--color-primary)" : "#E2E8F0",
                  color: item.done ? "#fff" : "#94A3B8",
                }}
              >
                {item.done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : item.step}
              </div>
              <span className="text-sm" style={{ color: item.done ? "#0F172A" : "#94A3B8" }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white no-underline transition-all"
          style={{
            borderRadius: "var(--radius)",
            background: "linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%)",
          }}
        >
          متابعة التسوّق ←
        </Link>
      </div>
    </div>
  );
}
