import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { orderUpdateSchema } from "@medic/core";
import { handleRoute, parseBody, ApiError } from "@/lib/api";
import { requireRole } from "@/lib/rbac";

const include = {
  items: {
    include: { product: { select: { nameAr: true, sku: true } } },
  },
} as const;

export function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id }, include });
    if (!order) throw new ApiError(404, "ORDER_NOT_FOUND", "الطلب غير موجود");
    return NextResponse.json(serialize(order));
  });
}

/** تعديل بيانات الطلب من لوحة الإدارة: تكلفة التوصيل الفعلية والملاحظات (ADMIN فقط). */
export function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const { id } = await params;
    const input = await parseBody(req, orderUpdateSchema);
    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "ORDER_NOT_FOUND", "الطلب غير موجود");
    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(input.customerName !== undefined && { customerName: input.customerName }),
        ...(input.customerPhone !== undefined && { customerPhone: input.customerPhone }),
        ...(input.governorate !== undefined && { governorate: input.governorate }),
        ...(input.customerAddress !== undefined && { customerAddress: input.customerAddress }),
        ...(input.actualDeliveryCost !== undefined && { actualDeliveryCost: input.actualDeliveryCost }),
        ...(input.notes !== undefined && { notes: input.notes }),
      },
      include,
    });
    return NextResponse.json(serialize(order));
  });
}

type OrderWithItems = NonNullable<Awaited<ReturnType<typeof prisma.order.findUnique>>>;

function serialize(o: OrderWithItems & { items: Array<{ unitPrice: unknown; [k: string]: unknown }> }) {
  return {
    ...o,
    total: Number(o.total),
    actualDeliveryCost: o.actualDeliveryCost != null ? Number(o.actualDeliveryCost) : null,
    items: o.items.map((i) => ({ ...i, unitPrice: Number(i.unitPrice) })),
  };
}
