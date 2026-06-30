import { NextResponse } from "next/server";
import { shiftCloseSchema } from "@medic/core";
import { handleRoute, parseBody, ApiError } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { getShiftDetail, closeShift } from "@/lib/services/shifts";

/** تفاصيل وردية مع إجمالياتها وفواتيرها. */
export function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const user = await requireRole("ADMIN", "CASHIER");
    const { id } = await params;
    const shift = await getShiftDetail(id);
    // الموظف لا يرى ورديات غيره.
    if (user.role !== "ADMIN" && (shift as { userId: string }).userId !== user.id) {
      throw new ApiError(403, "FORBIDDEN", "لا تملك صلاحية عرض هذه الوردية");
    }
    return NextResponse.json(shift);
  });
}

/** إغلاق الوردية بعدّ النقد الفعلي. */
export function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const user = await requireRole("ADMIN", "CASHIER");
    const { id } = await params;
    const input = await parseBody(req, shiftCloseSchema);
    const shift = await closeShift(id, user.id, user.role, input);
    return NextResponse.json(shift);
  });
}
