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

/** تعديل بيانات الطلب من لوحة الإدارة: تفاصيل الزبون + تكلفة التوصيل + الملاحظات + كميات/أسعار الأصناف (ADMIN فقط). */
export function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const { id } = await params;
    const input = await parseBody(req, orderUpdateSchema);

    const order = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({ where: { id }, include: { items: true } });
      if (!existing) throw new ApiError(404, "ORDER_NOT_FOUND", "الطلب غير موجود");

      const data: Record<string, unknown> = {
        ...(input.customerName !== undefined && { customerName: input.customerName }),
        ...(input.customerPhone !== undefined && { customerPhone: input.customerPhone }),
        ...(input.governorate !== undefined && { governorate: input.governorate }),
        ...(input.customerAddress !== undefined && { customerAddress: input.customerAddress }),
        ...(input.actualDeliveryCost !== undefined && { actualDeliveryCost: input.actualDeliveryCost }),
        ...(input.notes !== undefined && { notes: input.notes }),
      };

      // تعديل الأصناف: نتحقّق أنّ كل صنف يخصّ هذا الطلب، نحدّث الكمية/السعر،
      // ثم نُعيد حساب إجمالي الطلب من القيم النهائية لجميع الأصناف.
      if (input.items && input.items.length > 0) {
        const byId = new Map(existing.items.map((i) => [i.id, i]));
        for (const it of input.items) {
          if (!byId.has(it.id)) {
            throw new ApiError(422, "ITEM_NOT_FOUND", "صنف غير موجود في هذا الطلب");
          }
        }
        await Promise.all(
          input.items.map((it) =>
            tx.orderItem.update({
              where: { id: it.id },
              data: { quantity: it.quantity, unitPrice: it.unitPrice },
            }),
          ),
        );
        const updates = new Map(input.items.map((it) => [it.id, it]));
        let total = 0;
        for (const item of existing.items) {
          const u = updates.get(item.id);
          const quantity = u ? u.quantity : item.quantity;
          const unitPrice = u ? u.unitPrice : Number(item.unitPrice);
          total += unitPrice * quantity;
        }
        data.total = total;
      }

      return tx.order.update({ where: { id }, data, include });
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
