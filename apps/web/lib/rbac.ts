import { headers } from "next/headers";
import { prisma } from "@medic/database";
import { auth } from "./auth";
import { ApiError } from "./api";
import { verifyClientToken } from "./jwt";

export interface AuthedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: "ADMIN" | "CASHIER";
}

/**
 * يتطلب هويّة موحّدة (FR-045): كوكي جلسة المتصفح **أو** `Authorization: Bearer <JWT>`
 * للعملاء غير-المتصفح (ديسكتوب/هاتف). يرمي 401 إن لم توجد هويّة صالحة.
 */
export async function requireUser(): Promise<AuthedUser> {
  // 1) جلسة المتصفح (Auth.js)
  const session = await auth();
  if (session?.user) {
    const u = session.user as { id?: string; name?: string | null; email?: string | null; role?: string };
    return {
      id: u.id ?? "",
      name: u.name,
      email: u.email,
      role: (u.role as "ADMIN" | "CASHIER") ?? "CASHIER",
    };
  }

  // 2) توكن Bearer (ديسكتوب/هاتف) — يُتحقَّق من وجود المستخدم وصحّة دوره الحالي
  const authHeader = (await headers()).get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (token) {
    const payload = await verifyClientToken(token);
    if (payload) {
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, name: true, email: true, role: true },
      });
      // رفض توكن مستخدم محذوف أو مُغيَّر الدور
      if (dbUser && dbUser.role === payload.role) {
        return { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role };
      }
    }
  }

  throw new ApiError(401, "UNAUTHORIZED", "يجب تسجيل الدخول");
}

/** يتطلب دورًا محددًا (ADMIN/CASHIER)؛ يرمي 403 عند عدم التطابق. */
export async function requireRole(...roles: Array<"ADMIN" | "CASHIER">): Promise<AuthedUser> {
  const user = await requireUser();
  if (roles.length > 0 && !roles.includes(user.role)) {
    throw new ApiError(403, "FORBIDDEN", "لا تملك صلاحية لهذا الإجراء");
  }
  return user;
}
