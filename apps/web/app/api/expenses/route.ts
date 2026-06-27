import { NextResponse } from "next/server";
import { expenseCreateSchema } from "@medic/core";
import { handleRoute, parseBody } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { listExpenses, createExpense } from "@/lib/services/expenses";

/** قائمة المصاريف (مع فلتر فترة اختياري) — للمالك فقط. */
export function GET(req: Request) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const sp = new URL(req.url).searchParams;
    const from = sp.get("from") ? new Date(sp.get("from")!) : undefined;
    const to = sp.get("to") ? new Date(sp.get("to")!) : undefined;
    return NextResponse.json(await listExpenses({ from, to }));
  });
}

/** تسجيل مصروف جديد. */
export function POST(req: Request) {
  return handleRoute(async () => {
    const user = await requireRole("ADMIN");
    const input = await parseBody(req, expenseCreateSchema);
    const expense = await createExpense(input, user.id as string);
    return NextResponse.json(expense, { status: 201 });
  });
}
