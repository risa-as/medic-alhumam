import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { handleRoute } from "@/lib/api";

/** منتجات المتجر العام: isOnline فقط، بدون مصادقة (FR-013). */
export function GET(req: Request) {
  return handleRoute(async () => {
    const sp = new URL(req.url).searchParams;
    const q = sp.get("q") ?? undefined;
    const categoryId = sp.get("categoryId") ?? undefined;

    const products = await prisma.product.findMany({
      where: {
        isOnline: true,
        ...(categoryId && { categoryId }),
        ...(q && { OR: [
          { nameAr: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ]}),
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { category: { select: { id: true, nameAr: true } } },
    });

    return NextResponse.json({
      data: products.map((p) => ({
        ...p,
        costPrice: undefined,    // لا يُرسَل للعميل العام
        salePrice: Number(p.salePrice),
        deliveryPrice: Number(p.deliveryPrice),
      })),
    });
  });
}
