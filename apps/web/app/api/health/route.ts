import { NextResponse } from "next/server";

/** فحص صحة بسيط للتأكد من عمل طبقة REST API. */
export function GET() {
  return NextResponse.json({ status: "ok", service: "medic-web" });
}
