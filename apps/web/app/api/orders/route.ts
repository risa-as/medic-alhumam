import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { orderCreateSchema } from "@medic/core";
import { handleRoute, parseBody } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { createOrder } from "@/lib/services/orders";

const include = {
  items: { include: { product: { select: { nameAr: true, sku: true } } } },
} as const;

/** إنشاء طلب — عام (متجر/landing) أو ADMIN (يدوي بمصدر FACEBOOK/INSTAGRAM/OTHER). */
export function POST(req: Request) {
  return handleRoute(async () => {
    const input = await parseBody(req, orderCreateSchema);
    const order = await createOrder(input);
    return NextResponse.json({
      ...order,
      total: Number(order.total),
      actualDeliveryCost: order.actualDeliveryCost != null ? Number(order.actualDeliveryCost) : null,
      items: order.items.map((i) => ({ ...i, unitPrice: Number(i.unitPrice) })),
    }, { status: 201 });
  });
}

/** قائمة الطلبات — ADMIN فقط، مع فلتر المصدر والحالة. */
export function GET(req: Request) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const sp = new URL(req.url).searchParams;
    const source = sp.get("source") ?? undefined;
    const status = sp.get("status") ?? undefined;

    const orders = await prisma.order.findMany({
      where: {
        ...(source && { source: source as never }),
        ...(status && { status: status as never }),
      },
      orderBy: { createdAt: "desc" },
      take: 200,
      include,
    });
    return NextResponse.json({ data: orders.map(serializeOrder) });
  });
}

function serializeOrder(o: {
  total: unknown;
  actualDeliveryCost: unknown;
  items: Array<{ unitPrice: unknown; [k: string]: unknown }>;
  [k: string]: unknown;
}) {
  return {
    ...o,
    total: Number(o.total),
    actualDeliveryCost: o.actualDeliveryCost != null ? Number(o.actualDeliveryCost) : null,
    items: o.items.map((i) => ({ ...i, unitPrice: Number(i.unitPrice) })),
  };
}
