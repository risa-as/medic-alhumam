import { NextResponse } from "next/server";
import { handleRoute } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { getFinancialReport } from "@/lib/services/reports";

/** التقرير المالي للمالك: أرباح/خسائر + مقارنة بالفترة السابقة (ADMIN). */
export function GET(req: Request) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const sp = new URL(req.url).searchParams;
    const to = sp.get("to") ? new Date(sp.get("to")!) : new Date();
    const from = sp.get("from")
      ? new Date(sp.get("from")!)
      : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
    const groupBy = sp.get("groupBy") === "week" ? "week" : "day";
    const result = await getFinancialReport(from, to, groupBy);
    return NextResponse.json(result);
  });
}
