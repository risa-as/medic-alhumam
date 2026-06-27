"use client";

import { useSearchParams } from "next/navigation";

export const fmt = (n: number) => Math.round(n).toLocaleString("ar-IQ");
export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("ar-IQ");
export const todayISO = () => new Date().toISOString().slice(0, 10);
export const daysAgoISO = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);
export const yesterdayISO = () => daysAgoISO(1);

/** بداية الأسبوع الحالي (السبت) بتوقيت UTC — متّسق مع todayISO. */
export const startOfWeekISO = () => {
  const d = new Date();
  const back = (d.getUTCDay() + 1) % 7; // 0=الأحد..6=السبت ⇒ الرجوع إلى آخر سبت
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - back)).toISOString().slice(0, 10);
};

/** أول يوم في الشهر الحالي بتوقيت UTC. */
export const startOfMonthISO = () => {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString().slice(0, 10);
};

/** نسبة التغيّر مقابل الفترة السابقة؛ null إذا كانت القيمة السابقة صفرًا. */
export function deltaPct(cur: number, prev: number): number | null {
  if (!prev) return null;
  return Math.round(((cur - prev) / prev) * 100);
}

/** يقرأ فترة التقرير من معاملات الرابط (مشتركة بين التبويبات) مع قيَم افتراضية. */
export function usePeriod() {
  const sp = useSearchParams();
  const from = sp.get("from") ?? daysAgoISO(30);
  const to = sp.get("to") ?? todayISO();
  const g = (sp.get("g") === "week" ? "week" : "day") as "day" | "week";
  const qs = `from=${from}T00:00:00.000Z&to=${to}T23:59:59.999Z&groupBy=${g}`;
  return { from, to, g, qs };
}
