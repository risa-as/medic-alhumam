import { notFound } from "next/navigation";
import { prisma } from "@medic/database";
import { ProductDetail } from "./ProductDetail";
import { toStorefrontProduct } from "@/lib/storefront";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id, isOnline: true },
    include: { category: { select: { nameAr: true } } },
  });
  if (!product) notFound();

  return <ProductDetail product={toStorefrontProduct(product)} />;
}
