import { Suspense } from "react";
import { ProductsGrid } from "./ProductsGrid";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoryId?: string; sort?: string; minPrice?: string; maxPrice?: string; page?: string }>;
}) {
  return (
    <div>
      {/* رأس الصفحة */}
      <div className="mb-5">
        <h1 className="text-xl font-extrabold" style={{ color: "#0F172A" }}>كل المنتجات</h1>
        <p className="mt-0.5 text-sm" style={{ color: "#94A3B8" }}>تصفّح كامل مجموعتنا من المستلزمات الطبية</p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center gap-2 py-20 text-sm" style={{ color: "#94A3B8" }}>
            <div className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: "#E2E8F0", borderTopColor: "var(--color-primary)" }} />
            جارٍ تحميل المنتجات...
          </div>
        }
      >
        <ProductsGrid searchParamsPromise={searchParams} />
      </Suspense>
    </div>
  );
}
