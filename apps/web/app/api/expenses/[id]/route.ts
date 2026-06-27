import { NextResponse } from "next/server";
import { expenseUpdateSchema } from "@medic/core";
import { handleRoute, parseBody } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { updateExpense, deleteExpense } from "@/lib/services/expenses";

export function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const { id } = await params;
    const input = await parseBody(req, expenseUpdateSchema);
    return NextResponse.json(await updateExpense(id, input));
  });
}

export function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const { id } = await params;
    await deleteExpense(id);
    return NextResponse.json({ ok: true });
  });
}
