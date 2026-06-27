import { NextResponse } from "next/server";
import { handleRoute, ApiError } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { getCustomerStatement } from "@/lib/services/customers";

export function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    await requireRole("ADMIN", "CASHIER");
    const { id } = await params;
    const statement = await getCustomerStatement(id);
    if (!statement) throw new ApiError(404, "CUSTOMER_NOT_FOUND", "الزبون غير موجود");
    return NextResponse.json(statement);
  });
}
