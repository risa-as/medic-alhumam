import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { customerSessionSchema } from "@medic/core";
import { handleRoute, parseBody } from "@/lib/api";

const COOKIE = "medic_customer";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 أيام

/** يقرأ معلومات الزبون من الكوكي (null إن لم توجد). */
export function GET() {
  return handleRoute(async () => {
    const store = await cookies();
    const raw = store.get(COOKIE)?.value;
    if (!raw) return NextResponse.json(null);
    try {
      const data = JSON.parse(raw);
      return NextResponse.json(customerSessionSchema.parse(data));
    } catch {
      return NextResponse.json(null);
    }
  });
}

/** يحفظ معلومات الزبون في كوكي الجلسة (بعد إرسال الـ landing). */
export function POST(req: Request) {
  return handleRoute(async () => {
    const session = await parseBody(req, customerSessionSchema);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, JSON.stringify(session), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
    });
    return res;
  });
}

/** يمسح كوكي الجلسة. */
export function DELETE() {
  return handleRoute(async () => {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete(COOKIE);
    return res;
  });
}
