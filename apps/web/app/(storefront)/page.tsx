import Link from "next/link";
import Image from "next/image";
import { Truck, Banknote, CheckCircle2, RotateCcw, HeartPulse, Flame, Stethoscope, Package, type LucideIcon } from "lucide-react";
import { prisma } from "@medic/database";
import { ProductCard } from "./_components/ProductCard";
import { toStorefrontProduct } from "@/lib/storefront";

export const revalidate = 60;

const TRUST: { icon: LucideIcon; title: string; sub: string }[] = [
  { icon: Truck,        title: "توصيل سريع",         sub: "لكل المحافظات" },
  { icon: Banknote,     title: "الدفع عند الاستلام", sub: "ادفع بعد الوصول" },
  { icon: CheckCircle2, title: "منتجات أصلية",       sub: "جودة مضمونة" },
  { icon: RotateCcw,    title: "إرجاع سهل",          sub: "خدمة ما بعد البيع" },
];

const CAT_GRADIENTS = [
  "linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%)",
  "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
  "linear-gradient(135deg, #E11D48 0%, #FB7185 100%)",
  "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
  "linear-gradient(135deg, #EA580C 0%, #FB923C 100%)",
  "linear-gradient(135deg, #0D9488 0%, #2DD4BF 100%)",
];

export default async function HomePage() {
  const [newest, deals, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isOnline: true },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { category: { select: { nameAr: true } } },
    }),
    prisma.product.findMany({
      where: { isOnline: true, compareAtPrice: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { category: { select: { nameAr: true } } },
    }),
    prisma.category.findMany({
      orderBy: { nameAr: "asc" },
      include: {
        products: {
          where: { isOnline: true, NOT: { images: { isEmpty: true } } },
          take: 1,
          select: { images: true },
        },
      },
    }),
  ]);

  const newestP = newest.map(toStorefrontProduct);
  const dealsP = deals
    .map(toStorefrontProduct)
    .filter((p) => p.compareAtPrice && p.compareAtPrice > p.salePrice);

  return (
    <div className="space-y-10">
      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
        <div
          className="relative px-6 py-12 sm:px-12 sm:py-16"
          style={{ background: "linear-gradient(120deg, var(--color-sidebar) 0%, var(--color-primary-hover) 45%, var(--color-primary) 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)", backgroundSize: "26px 26px" }}
          />
          <div className="relative max-w-xl text-white">
            <span className="inline-flex items-center gap-1.5 rounded-[var(--radius)] bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <HeartPulse className="h-4 w-4" /> صحتك تستحق الأفضل
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              كل مستلزماتك الطبية في مكان واحد
            </h1>
            <p className="mt-3 text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.82)" }}>
              عكازات · كراسي متحركة · أحزمة طبية · معدات التأهيل — بأسعار منافسة وتوصيل لكل المحافظات.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold no-underline transition-all"
                style={{ borderRadius: "var(--radius)", background: "#fff", color: "var(--color-primary-hover)" }}
              >
                تسوّق الآن ←
              </Link>
              {dealsP.length > 0 && (
                <Link
                  href="/products?sort=price_asc"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white no-underline transition-all"
                  style={{ borderRadius: "var(--radius)", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.35)" }}
                >
                  شاهد العروض <Flame className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ شريط الثقة ═══ */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TRUST.map((t) => (
          <div key={t.title} className="flex items-center gap-3 px-4 py-3" style={{ borderRadius: "var(--radius)", background: "#fff", border: "1px solid #EEF2F6" }}>
            <t.icon className="h-6 w-6 shrink-0" style={{ color: "var(--color-primary)" }} />
            <div>
              <p className="text-xs font-bold" style={{ color: "#0F172A" }}>{t.title}</p>
              <p className="text-[11px]" style={{ color: "#94A3B8" }}>{t.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ═══ الفئات ═══ */}
      {categories.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-extrabold" style={{ color: "#0F172A" }}>تسوّق حسب الفئة</h2>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {categories.map((c, i) => {
              const img = c.products[0]?.images[0];
              return (
                <Link key={c.id} href={`/products?categoryId=${c.id}`} className="group flex flex-col items-center gap-2 no-underline">
                  <div
                    className="relative flex h-16 w-16 items-center justify-center overflow-hidden text-2xl text-white transition-transform group-hover:scale-105 sm:h-20 sm:w-20"
                    style={{ borderRadius: "var(--radius)", background: CAT_GRADIENTS[i % CAT_GRADIENTS.length] }}
                  >
                    {img ? (
                      <Image src={img} alt={c.nameAr} fill className="object-cover" sizes="80px" />
                    ) : (
                      <Stethoscope className="h-7 w-7" />
                    )}
                  </div>
                  <span className="text-center text-[11px] font-semibold leading-tight" style={{ color: "#475569" }}>
                    {c.nameAr}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══ العروض والخصومات ═══ */}
      {dealsP.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-extrabold" style={{ color: "#0F172A" }}>
              <Flame className="h-5 w-5" style={{ color: "#E11D48" }} /> عروض وخصومات
            </h2>
            <Link href="/products" className="text-sm font-bold no-underline" style={{ color: "#E11D48" }}>عرض الكل ←</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {dealsP.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ═══ وصل حديثًا ═══ */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold" style={{ color: "#0F172A" }}>وصل حديثًا</h2>
          <Link href="/products" className="text-sm font-bold no-underline" style={{ color: "var(--color-primary)" }}>عرض الكل ←</Link>
        </div>

        {newestP.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center" style={{ borderRadius: "var(--radius)", border: "1px dashed #E2E8F0", background: "#fff" }}>
            <Package className="h-10 w-10 opacity-40" strokeWidth={1.5} />
            <p className="text-sm" style={{ color: "#94A3B8" }}>لا توجد منتجات متاحة حاليًا</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {newestP.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
