import Link from "next/link";
import { Suspense } from "react";
import { Truck, Banknote, CheckCircle2, Stethoscope, Heart, ShoppingCart } from "lucide-react";
import { getStoreSetting } from "@/lib/settings";
import { getCategoriesCached } from "@/lib/catalog";
import { CartIcon } from "./_components/CartIcon";
import { WishlistIcon } from "./_components/WishlistIcon";
import { SearchBar } from "./_components/SearchBar";

export const revalidate = 300;

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const [categories, { storeName }] = await Promise.all([
    getCategoriesCached(),
    getStoreSetting(),
  ]);

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC", direction: "rtl" }}>
      {/* ═══ شريط علوي ═══ */}
      <div className="text-white" style={{ background: "linear-gradient(90deg, var(--color-sidebar) 0%, var(--color-primary) 100%)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-5 px-4 py-1.5 text-[11px] font-medium">
          <span className="inline-flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> توصيل لكل المحافظات</span>
          <span className="opacity-50">·</span>
          <span className="inline-flex items-center gap-1.5"><Banknote className="h-3.5 w-3.5" /> الدفع عند الاستلام</span>
          <span className="hidden opacity-50 sm:inline">·</span>
          <span className="hidden items-center gap-1.5 sm:inline-flex"><CheckCircle2 className="h-3.5 w-3.5" /> منتجات أصلية مضمونة</span>
        </div>
      </div>

      {/* ═══ الهيدر الرئيسي ═══ */}
      <header className="sticky top-0 z-40" style={{ background: "#fff", boxShadow: "0 1px 8px rgba(15,23,42,0.06)" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-4 py-3">
            {/* الشعار */}
            <Link href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
              <div className="flex h-10 w-10 items-center justify-center text-white" style={{ borderRadius: "var(--radius)", background: "linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%)" }}>
                <Stethoscope className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-extrabold leading-tight" style={{ color: "#0F172A" }}>{storeName}</p>
                <p className="text-[10px]" style={{ color: "#94A3B8" }}>Medical Supplies Store</p>
              </div>
            </Link>

            {/* البحث — على الشاشات المتوسطة فأكبر */}
            <div className="hidden flex-1 md:block">
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>
            </div>

            {/* أيقونات */}
            <nav className="flex shrink-0 items-center gap-1">
              <Suspense fallback={<span className="flex h-10 w-10 items-center justify-center" style={{ color: "#E11D48" }}><Heart className="h-[22px] w-[22px]" /></span>}>
                <WishlistIcon />
              </Suspense>
              <Suspense fallback={<span className="flex h-10 w-10 items-center justify-center" style={{ color: "var(--color-primary-hover)" }}><ShoppingCart className="h-[22px] w-[22px]" /></span>}>
                <CartIcon />
              </Suspense>
            </nav>
          </div>

          {/* البحث على الجوال */}
          <div className="pb-3 md:hidden">
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>
        </div>

        {/* ═══ شريط الفئات ═══ */}
        <div className="border-t" style={{ borderColor: "#F1F5F9" }}>
          <div className="mx-auto max-w-7xl px-4">
            <nav className="flex items-center gap-1.5 overflow-x-auto py-2" style={{ scrollbarWidth: "none" }}>
              <Link href="/products" className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-bold no-underline transition-colors" style={{ borderRadius: "var(--radius)", color: "var(--color-primary-hover)", background: "var(--color-primary-light)" }}>
                كل المنتجات
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?categoryId=${c.id}`}
                  className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-medium no-underline transition-colors"
                  style={{ borderRadius: "var(--radius)", color: "#475569" }}
                >
                  {c.nameAr}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ═══ المحتوى ═══ */}
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>

      {/* ═══ التذييل ═══ */}
      <footer className="mt-16 border-t py-10" style={{ borderColor: "#E2E8F0", background: "#fff" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center text-white" style={{ borderRadius: "var(--radius)", background: "var(--color-primary)" }}><Stethoscope className="h-[18px] w-[18px]" /></div>
                <span className="text-sm font-extrabold" style={{ color: "#0F172A" }}>{storeName}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
                وجهتك الموثوقة لعكازات وكراسي متحركة وأحزمة طبية ومعدات التأهيل — بجودة مضمونة وتوصيل لكل المحافظات.
              </p>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold" style={{ color: "#0F172A" }}>روابط سريعة</p>
              <ul className="space-y-1.5 text-xs" style={{ color: "#64748B" }}>
                <li><Link href="/products" className="no-underline" style={{ color: "#64748B" }}>كل المنتجات</Link></li>
                <li><Link href="/favorites" className="no-underline" style={{ color: "#64748B" }}>المفضّلة</Link></li>
                <li><Link href="/cart" className="no-underline" style={{ color: "#64748B" }}>سلة الشراء</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold" style={{ color: "#0F172A" }}>مزايا التسوّق معنا</p>
              <ul className="space-y-1.5 text-xs" style={{ color: "#64748B" }}>
                <li className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 shrink-0" /> توصيل سريع لكل المحافظات</li>
                <li className="flex items-center gap-1.5"><Banknote className="h-3.5 w-3.5 shrink-0" /> الدفع عند الاستلام</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> منتجات أصلية مضمونة</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 border-t pt-5 text-center text-xs" style={{ borderColor: "#F1F5F9", color: "#94A3B8" }}>
            جميع الحقوق محفوظة © {new Date().getFullYear()} {storeName}
          </p>
        </div>
      </footer>
    </div>
  );
}
