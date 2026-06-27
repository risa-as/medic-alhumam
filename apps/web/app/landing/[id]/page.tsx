import { notFound } from "next/navigation";
import { prisma } from "@medic/database";
import { LandingClient } from "./LandingClient";
import { toStorefrontProduct } from "@/lib/storefront";
import { getStoreSetting } from "@/lib/settings";

export default async function LandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ source?: string }>;
}) {
  const { id } = await params;
  const { source } = await searchParams;

  const [product, setting] = await Promise.all([
    prisma.product.findFirst({
      where: { id, isOnline: true },
      include: { category: { select: { nameAr: true } } },
    }),
    getStoreSetting(),
  ]);
  if (!product) notFound();

  return (
    <LandingClient
      product={toStorefrontProduct(product)}
      source={source ?? "LANDING_PAGE"}
      storeName={setting.storeName}
      logoUrl={setting.logoUrl}
    />
  );
}
