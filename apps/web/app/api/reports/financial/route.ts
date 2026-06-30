import { NextResponse } from "next/server";
import { handleRoute } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { getFinancialReport, type TimeOfDayFilter } from "@/lib/services/reports";

/** "HH:MM" → دقائق من منتصف الليل، أو null إن كان غير صالح. */
function parseTimeMin(v: string | null): number | null {
  if (!v) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(v.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

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

    // فلتر نطاق الوقت اليومي (اختياري): fromTime/toTime بصيغة HH:MM + إزاحة المنطقة الزمنية للعميل.
    const fromMin = parseTimeMin(sp.get("fromTime"));
    const toMin = parseTimeMin(sp.get("toTime"));
    const tzOffsetRaw = sp.get("tzOffset");
    let timeFilter: TimeOfDayFilter | null = null;
    if (fromMin != null && toMin != null && fromMin !== toMin) {
      timeFilter = { fromMin, toMin, tzOffset: tzOffsetRaw != null ? Number(tzOffsetRaw) : 0 };
    }

    const result = await getFinancialReport(from, to, groupBy, timeFilter);
    return NextResponse.json(result);
  });
}
