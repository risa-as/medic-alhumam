import { NextResponse } from "next/server";
import { handleRoute } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { getInventoryReport } from "@/lib/services/reports";

/** تقرير المخزون والركود وقرب انتهاء الصلاحية للمالك (ADMIN). */
export function GET(req: Request) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const sp = new URL(req.url).searchParams;
    const staleDays = Math.max(7, Math.min(365, Number(sp.get("staleDays")) || 60));
    const expiryDays = Math.max(7, Math.min(365, Number(sp.get("expiryDays")) || 60));
    const result = await getInventoryReport({ staleDays, expiryDays });
    return NextResponse.json(result);
  });
}
