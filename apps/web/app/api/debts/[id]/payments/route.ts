import { NextResponse } from "next/server";
import { debtPaymentCreateSchema } from "@medic/core";
import { handleRoute, parseBody } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { recordDebtPayment } from "@/lib/services/debts";

export function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const user = await requireRole("ADMIN", "CASHIER");
    const { id } = await params;
    const { amount } = await parseBody(req, debtPaymentCreateSchema);
    const result = await recordDebtPayment(id, amount, user.id as string);
    return NextResponse.json(result, { status: 201 });
  });
}
