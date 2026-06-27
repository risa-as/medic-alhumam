/** تنسيق الأرقام والتواريخ بالعربية (العراق) — مصدر موحّد لكل الصفحات. */
export const fmt = (n: number) => n.toLocaleString("ar-IQ");

export const fmtDate = (iso: string | Date) =>
  new Date(iso).toLocaleDateString("ar-IQ");
