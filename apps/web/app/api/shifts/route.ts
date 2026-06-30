import { NextResponse } from "next/server";
import { shiftOpenSchema } from "@medic/core";
import { handleRoute, parseBody } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { openShift, listShifts } from "@/lib/services/shifts";

/** فتح وردية للمستخدم الحالي (نقطة البيع — الهاتف). */
export function POST(req: Request) {
  return handleRoute(async () => {
    const user = await requireRole("ADMIN", "CASHIER");
    const input = await parseBody(req, shiftOpenSchema);
    const shift = await openShift(user.id, input);
    return NextResponse.json(shift, { status: 201 });
  });
}

/** قائمة الورديات — المالك يرى الكل (للتقارير)، والموظف يرى ورديّاته فقط. */
export function GET(req: Request) {
  return handleRoute(async () => {
    const user = await requireRole("ADMIN", "CASHIER");
    const sp = new URL(req.url).searchParams;
    const status = sp.get("status");
    const userIdParam = sp.get("userId");
    const from = sp.get("from");
    const to = sp.get("to");

    const data = await listShifts({
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      status: status === "OPEN" || status === "CLOSED" ? status : undefined,
      // الموظف مقيَّد بورديّاته؛ المالك يمكنه التصفية بـ userId.
      userId: user.role === "ADMIN" ? (userIdParam ?? undefined) : user.id,
    });
    return NextResponse.json({ data });
  });
}
