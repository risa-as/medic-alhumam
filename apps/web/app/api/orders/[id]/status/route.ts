import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { orderStatusUpdateSchema } from "@medic/core";
import { handleRoute, parseBody, ApiError } from "@/lib/api";
import { requireRole } from "@/lib/rbac";

// يُسمح بنقل الطلب من أي حالة إلى أي حالة أخرى (تحريك حرّ بين التابات).
const ALL_STATUSES = ["HOME", "PENDING", "COMPLETED", "RETURNED", "CANCELLED", "DELETED"];
const VALID_TRANSITIONS: Record<string, string[]> = Object.fromEntries(
  ALL_STATUSES.map((s) => [s, ALL_STATUSES.filter((t) => t !== s)]),
);

export function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const { id } = await params;
    const { status } = await parseBody(req, orderStatusUpdateSchema);

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new ApiError(404, "ORDER_NOT_FOUND", "الطلب غير موجود");

    const allowed = VALID_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(status)) {
      throw new ApiError(
        409,
        "INVALID_TRANSITION",
        `لا يمكن تحويل الطلب من "${order.status}" إلى "${status}"`,
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { product: { select: { nameAr: true, sku: true } } } } },
    });

    return NextResponse.json({
      ...updated,
      total: Number(updated.total),
      items: updated.items.map((i) => ({ ...i, unitPrice: Number(i.unitPrice) })),
    });
  });
}
