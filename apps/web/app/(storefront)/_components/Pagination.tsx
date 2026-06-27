import Link from "next/link";

/** ترقيم صفحات بسيط — روابط server تحافظ على بقيّة معاملات الـ URL. */
export function Pagination({
  page,
  totalPages,
  makeHref,
}: {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  // نافذة صفحات حول الصفحة الحالية
  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = Math.max(1, end - 4); i <= end; i++) pages.push(i);

  const pill = (active: boolean): React.CSSProperties => ({
    minWidth: 38,
    height: 38,
    borderRadius: "var(--radius)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 10px",
    fontSize: 13,
    fontWeight: active ? 700 : 500,
    textDecoration: "none",
    border: active ? "1.5px solid var(--color-primary)" : "1.5px solid #E2E8F0",
    background: active ? "linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%)" : "#fff",
    color: active ? "#fff" : "#475569",
  });

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="ترقيم الصفحات">
      {page > 1 && (
        <Link href={makeHref(page - 1)} style={pill(false)} className="transition-all">
          ‹ السابق
        </Link>
      )}
      {start > 1 && (
        <>
          <Link href={makeHref(1)} style={pill(false)} className="transition-all">1</Link>
          <span style={{ color: "#94A3B8" }}>…</span>
        </>
      )}
      {pages.map((p) => (
        <Link key={p} href={makeHref(p)} style={pill(p === page)} className="transition-all">
          {p.toLocaleString("ar-IQ")}
        </Link>
      ))}
      {end < totalPages && (
        <>
          <span style={{ color: "#94A3B8" }}>…</span>
          <Link href={makeHref(totalPages)} style={pill(false)} className="transition-all">
            {totalPages.toLocaleString("ar-IQ")}
          </Link>
        </>
      )}
      {page < totalPages && (
        <Link href={makeHref(page + 1)} style={pill(false)} className="transition-all">
          التالي ›
        </Link>
      )}
    </nav>
  );
}
