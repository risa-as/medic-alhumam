import { ApiError } from "./api";

/**
 * مصادقة جهاز المزامنة عبر سرّ مشترك (Bearer).
 * يُضبط عبر متغيّر البيئة SYNC_SECRET على الخادم والديسكتوب.
 */
export function requireSyncAuth(req: Request): void {
  const secret = process.env.SYNC_SECRET;
  if (!secret) {
    throw new ApiError(500, "SYNC_NOT_CONFIGURED", "سرّ المزامنة غير مُهيّأ على الخادم");
  }
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token !== secret) {
    throw new ApiError(401, "SYNC_UNAUTHORIZED", "جهاز مزامنة غير مصرّح");
  }
}

/** مستخدم النظام المستخدم لنسب فواتير المزامنة (أول ADMIN). */
export async function syncSystemUserId(): Promise<string> {
  const { prisma } = await import("@medic/database");
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" }, orderBy: { createdAt: "asc" } });
  if (!admin) throw new ApiError(500, "NO_ADMIN", "لا يوجد مستخدم مدير لنسب الفواتير");
  return admin.id;
}
