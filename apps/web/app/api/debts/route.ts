import { NextResponse } from "next/server";
import { handleRoute } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { listDebts } from "@/lib/services/debts";

export function GET(req: Request) {
  return handleRoute(async () => {
    await requireRole("ADMIN", "CASHIER");
    const params = new URL(req.url).searchParams;
    const status = params.get("status") as "OPEN" | "PARTIAL" | "PAID" | null;
    const search = params.get("search");
    const result = await listDebts(status ?? undefined, search ?? undefined);
    return NextResponse.json(result);
  });
}
