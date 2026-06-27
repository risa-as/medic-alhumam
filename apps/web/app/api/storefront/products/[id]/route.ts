import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { handleRoute, ApiError } from "@/lib/api";

/** تفاصيل منتج للمتجر (صور + فيديو + حقول مخصّصة). */
export function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: { id, isOnline: true },
      include: { category: { select: { id: true, nameAr: true } } },
    });
    if (!product) throw new ApiError(404, "NOT_FOUND", "المنتج غير موجود");
    return NextResponse.json({
      ...product,
      costPrice: undefined,
      salePrice: Number(product.salePrice),
      deliveryPrice: Number(product.deliveryPrice),
    });
  });
}
