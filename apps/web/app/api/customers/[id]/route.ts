import { NextResponse } from "next/server";
import { Prisma, prisma } from "@medic/database";
import { customerCreateSchema } from "@medic/core";
import { handleRoute, parseBody, ApiError } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { getCustomerWithSummary } from "@/lib/services/customers";

export function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN", "CASHIER");
    const { id } = await params;
    const customer = await getCustomerWithSummary(id);
    if (!customer) throw new ApiError(404, "CUSTOMER_NOT_FOUND", "الزبون غير موجود");
    return NextResponse.json(customer);
  });
}

export function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN", "CASHIER");
    const { id } = await params;
    const input = await parseBody(req, customerCreateSchema.partial());
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(input.name    !== undefined && { name:    input.name }),
        ...(input.phone   !== undefined && { phone:   input.phone || null }),
        ...(input.address !== undefined && { address: input.address || null }),
      },
    });
    return NextResponse.json(customer);
  });
}

export function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const { id } = await params;
    try {
      await prisma.customer.delete({ where: { id } });
    } catch (e) {
      // قيد مفتاح أجنبي: للزبون فواتير أو ديون مرتبطة
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
        throw new ApiError(409, "CUSTOMER_HAS_HISTORY", "لا يمكن حذف زبون له فواتير أو ديون مرتبطة");
      }
      throw e;
    }
    return NextResponse.json({ ok: true });
  });
}
