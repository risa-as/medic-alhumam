import { NextResponse } from "next/server";
import { syncPushSchema } from "@medic/core";
import { handleRoute, parseBody } from "@/lib/api";
import { requireSyncAuth, syncSystemUserId } from "@/lib/sync-auth";
import { recordSyncedSale, type SyncResult } from "@/lib/services/sales";

/** يستقبل دفعة من فواتير الديسكتوب ويسجّلها بشكل idempotent. */
export function POST(req: Request) {
  return handleRoute(async () => {
    requireSyncAuth(req);
    const { events } = await parseBody(req, syncPushSchema);
    const userId = await syncSystemUserId();

    const results: SyncResult[] = [];
    for (const event of events) {
      results.push(await recordSyncedSale(event, userId));
    }
    return NextResponse.json({ results });
  });
}
