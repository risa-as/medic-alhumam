import { NextResponse } from "next/server";
import { syncPushSchema } from "@medic/core";
import { handleRoute, parseBody } from "@/lib/api";
import { requireSyncAuth, syncSystemUserId } from "@/lib/sync-auth";
import { recordSyncedSale, type SyncResult } from "@/lib/services/sales";
import { recordSyncedShift, resolveShiftIdByClientEvent } from "@/lib/services/shifts";

/** يستقبل دفعة من فواتير الديسكتوب وأحداث ورديّاته ويسجّلها بشكل idempotent. */
export function POST(req: Request) {
  return handleRoute(async () => {
    requireSyncAuth(req);
    const { events, shiftEvents } = await parseBody(req, syncPushSchema);
    const userId = await syncSystemUserId();

    // 1) أحداث الورديات أولًا (فتح/إغلاق) — لتتمكّن الفواتير من الارتباط بها.
    //    نبني خريطة clientEventId → معرّف الوردية على الخادم.
    const shiftIdByClientEvent = new Map<string, string>();
    // النتائج مفهرسة بـ eventKey (مفتاح عنصر الطابور على العميل) ليطابقها العميل ويعلّمها مُزامَنة.
    const shiftResults: Array<{ clientEventId: string; status: "ok" | "error"; message?: string }> = [];
    for (const ev of shiftEvents) {
      try {
        const { shiftClientEventId, eventKey, shiftId } = await recordSyncedShift(ev, userId);
        shiftIdByClientEvent.set(shiftClientEventId, shiftId);
        shiftResults.push({ clientEventId: eventKey, status: "ok" });
      } catch (e) {
        shiftResults.push({
          clientEventId: ev.eventKey ?? ev.clientEventId,
          status: "error",
          message: e instanceof Error ? e.message : "خطأ غير معروف",
        });
      }
    }

    // 2) الفواتير — تُربط بالوردية عبر shiftClientEventId (من هذه الدفعة أو دفعة سابقة).
    const results: SyncResult[] = [];
    for (const event of events) {
      let shiftId: string | null = null;
      if (event.shiftClientEventId) {
        shiftId =
          shiftIdByClientEvent.get(event.shiftClientEventId) ??
          (await resolveShiftIdByClientEvent(event.shiftClientEventId));
      }
      results.push(await recordSyncedSale(event, userId, shiftId));
    }

    return NextResponse.json({ results, shiftResults });
  });
}
