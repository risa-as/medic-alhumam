import Link from "next/link";
import { Search, X } from "lucide-react";
import { Prisma, prisma } from "@medic/database";
import { ProductCard } from "../_components/ProductCard";
import { Toolbar } from "../_components/Toolbar";
import { PriceFilter } from "../_components/PriceFilter";
import { Pagination } from "../_components/Pagination";
import { toStorefrontProduct } from "@/lib/storefront";
import { getCategoriesCached } from "@/lib/catalog";

const PAGE_SIZE = 12;

type SP = { q?: string; categoryId?: string; sort?: string; minPrice?: string; maxPrice?: string; page?: string };

export async function ProductsGrid({ searchParamsPromise }: { searchParamsPromise: Promise<SP> }) {
  const sp = await searchParamsPromise;
  const q = sp.q ?? "";
  const categoryId = sp.categoryId ?? "";
  const sort = sp.sort ?? "newest";
  const minPrice = sp.minPrice && !Number.isNaN(Number(sp.minPrice)) ? Number(sp.minPrice) : undefined;
  const maxPrice = sp.maxPrice && !Number.isNaN(Number(sp.maxPrice)) ? Number(sp.maxPrice) : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc" ? { salePrice: "asc" }
    : sort === "price_desc" ? { salePrice: "desc" }
    : sort === "name" ? { nameAr: "asc" }
    : { createdAt: "desc" };

  const where: Prisma.ProductWhereInput = {
    isOnline: true,
    ...(categoryId && { categoryId }),
    ...(q && {
      OR: [
        { nameAr: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      salePrice: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: { select: { nameAr: true } } },
    }),
    prisma.product.count({ where }),
    getCategoriesCached(),
  ]);

  const formatted = products.map(toStorefrontProduct);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // بنّاء روابط يحافظ على الفلاتر الحالية
  const buildHref = (over: Record<string, string | number | null | undefined>) => {
    const params = new URLSearchParams();
    const merged: Record<string, string | undefined> = {
      q: q || undefined,
      categoryId: categoryId || undefined,
      sort: sort !== "newest" ? sort : undefined,
      minPrice: minPrice !== undefined ? String(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? String(maxPrice) : undefined,
      ...Object.fromEntries(Object.entries(over).map(([k, v]) => [k, v === undefined || v === null ? undefined : String(v)])),
    };
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  const catChip = (active: boolean): React.CSSProperties => ({
    display: "block",
    padding: "8px 12px",
    borderRadius: "var(--radius)",
    fontSize: 13,
    fontWeight: active ? 700 : 500,
    textDecoration: "none",
    background: active ? "var(--color-primary-light)" : "transparent",
    color: active ? "var(--color-primary-hover)" : "#475569",
    border: active ? "1px solid var(--color-primary-light)" : "1px solid transparent",
  });

  return (
    <div className="lg:flex lg:gap-6">
      {/* ─── الفلاتر الجانبية ─── */}
      <aside className="mb-4 space-y-4 lg:mb-0 lg:w-60 lg:shrink-0">
        <PriceFilter />
        <div className="hidden lg:block" style={{ borderRadius: "var(--radius)", background: "#fff", border: "1px solid #E2E8F0" }}>
          <p className="border-b px-4 py-3 text-sm font-bold" style={{ borderColor: "#F1F5F9", color: "#0F172A" }}>الفئات</p>
          <div className="space-y-0.5 p-2">
            <Link href={buildHref({ categoryId: undefined, page: undefined })} style={catChip(!categoryId)}>كل المنتجات</Link>
            {categories.map((c) => (
              <Link key={c.id} href={buildHref({ categoryId: c.id, page: undefined })} style={catChip(categoryId === c.id)}>
                {c.nameAr}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* ─── النتائج ─── */}
      <div className="min-w-0 flex-1">
        {/* لافتة البحث */}
        {q && (
          <div className="mb-4 flex items-center gap-2 px-4 py-2.5 text-sm" style={{ borderRadius: "var(--radius)", background: "var(--color-primary-light)", border: "1px solid var(--color-primary-light)", color: "var(--color-primary-hover)" }}>
            <Search className="h-4 w-4 shrink-0" />
            <span>نتائج البحث عن: <strong>&quot;{q}&quot;</strong> — {total.toLocaleString("ar-IQ")} منتج</span>
            <Link href={buildHref({ q: undefined, page: undefined })} className="mr-auto inline-flex items-center gap-1 text-xs no-underline" style={{ color: "var(--color-primary-hover)" }}><X className="h-3.5 w-3.5" /> مسح</Link>
          </div>
        )}

        <Toolbar count={total} />

        {formatted.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center" style={{ borderRadius: "var(--radius)", border: "1px dashed #E2E8F0", background: "#fff" }}>
            <Search className="h-12 w-12 opacity-30" strokeWidth={1.5} />
            <p className="text-sm font-medium" style={{ color: "#64748B" }}>
              {q ? `لا توجد منتجات لـ "${q}"` : "لا توجد منتجات مطابقة"}
            </p>
            <Link href="/products" className="px-4 py-2 text-sm font-semibold text-white no-underline" style={{ borderRadius: "var(--radius)", background: "var(--color-primary)" }}>
              عرض جميع المنتجات
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {formatted.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            <Pagination page={page} totalPages={totalPages} makeHref={(p) => buildHref({ page: p > 1 ? p : undefined })} />
          </>
        )}
      </div>
    </div>
  );
}
