import { NextResponse } from "next/server";
import { handleRoute } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { getCurrentOpenShift } from "@/lib/services/shifts";

/** الوردية المفتوحة الحالية للمستخدم (أو null) — يستخدمها الهاتف لاستئناف الوردية. */
export function GET() {
  return handleRoute(async () => {
    const user = await requireRole("ADMIN", "CASHIER");
    const shift = await getCurrentOpenShift(user.id);
    return NextResponse.json({ shift });
  });
}
