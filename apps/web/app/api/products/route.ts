import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { productCreateSchema } from "@medic/core";
import { handleRoute, parseBody } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { listProducts, serializeProduct } from "@/lib/services/products";

export function GET(req: Request) {
  return handleRoute(async () => {
    const user = await requireRole("ADMIN", "CASHIER");
    const sp = new URL(req.url).searchParams;
    const data = await listProducts({
      categoryId: sp.get("categoryId") ?? undefined,
      q: sp.get("q") ?? undefined,
      online: sp.has("online") ? sp.get("online") === "true" : undefined,
      lowStock: sp.get("lowStock") === "true",
      hideCostPrice: user.role !== "ADMIN",
    });
    return NextResponse.json({ data });
  });
}

export function POST(req: Request) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const input = await parseBody(req, productCreateSchema);
    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          nameAr: input.nameAr,
          sku: input.sku,
          categoryId: input.categoryId,
          costPrice: input.costPrice,
          salePrice: input.salePrice,
          compareAtPrice: input.compareAtPrice ?? null,
          deliveryPrice: input.deliveryPrice,
          quantity: input.quantity,
          minQuantity: input.minQuantity,
          images: input.images,
          videoUrl: input.videoUrl ?? null,
          description: input.description ?? null,
          isOnline: input.isOnline,
          customFields: input.customFields,
        },
      });
      // المخزون الافتتاحي ⇒ دفعة FEFO أولى بسعر شرائه (حتى تُحتسب تكلفته عند البيع)
      if (input.quantity > 0) {
        await tx.productBatch.create({
          data: {
            productId: created.id,
            costPrice: input.costPrice,
            quantity: input.quantity,
            remaining: input.quantity,
            reason: "رصيد افتتاحي عند إنشاء المنتج",
          },
        });
      }
      return created;
    });
    return NextResponse.json(serializeProduct(product), { status: 201 });
  });
}
