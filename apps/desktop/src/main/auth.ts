import { app, safeStorage } from "electron";
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { apiBaseUrl } from "./config";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CASHIER";
  token?: string; // JWT عند الدخول الأونلاين (يُستخدم لطلبات API الموثّقة بالمستخدم)
}

let current: SessionUser | null = null;

function sessionPath(): string {
  return path.join(app.getPath("userData"), "medic-session.bin");
}

/** يحفظ الجلسة الحالية مشفّرة على القرص (safeStorage) لاستعادتها عند إعادة التشغيل. */
function persistSession(user: SessionUser | null): void {
  try {
    if (!user) {
      if (fs.existsSync(sessionPath())) fs.unlinkSync(sessionPath());
      return;
    }
    const json = JSON.stringify(user);
    const buf = safeStorage.isEncryptionAvailable()
      ? safeStorage.encryptString(json)
      : Buffer.from(json, "utf8");
    fs.writeFileSync(sessionPath(), buf);
  } catch {
    // تجاهل أخطاء الحفظ — الجلسة تبقى في الذاكرة
  }
}

/** يستعيد الجلسة المحفوظة (إن وُجدت) عند الإقلاع. */
export function restoreSession(): SessionUser | null {
  try {
    if (!fs.existsSync(sessionPath())) return null;
    const buf = fs.readFileSync(sessionPath());
    const json = safeStorage.isEncryptionAvailable()
      ? safeStorage.decryptString(buf)
      : buf.toString("utf8");
    current = JSON.parse(json) as SessionUser;
    return current;
  } catch {
    return null;
  }
}

/**
 * تسجيل دخول هجين (FR-052):
 * - أونلاين: POST /api/auth/token → JWT + بيانات المستخدم.
 * - أوفلاين/فشل الشبكة: تحقّق bcrypt محليًا ضد مرآة LocalUser.
 */
export async function login(email: string, password: string): Promise<SessionUser> {
  // 1) محاولة أونلاين
  try {
    const res = await fetch(`${apiBaseUrl}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        token: string;
        user: { id: string; name: string; email: string; role: "ADMIN" | "CASHIER" };
      };
      current = { ...data.user, token: data.token };
      persistSession(current);
      return current;
    }
    if (res.status === 401) {
      // الخادم متاح ورفض البيانات — لا نُكمل للأوفلاين
      throw new Error("بيانات الدخول غير صحيحة");
    }
  } catch (e) {
    if (e instanceof Error && e.message === "بيانات الدخول غير صحيحة") throw e;
    // غير ذلك: الشبكة غير متاحة — ننتقل للتحقق الأوفلاين
  }

  // 2) تحقّق أوفلاين
  const localUser = await db.localUser.findUnique({ where: { email } });
  if (!localUser) throw new Error("لا يمكن تسجيل الدخول دون اتصال: المستخدم غير مُزامَن بعد");
  const valid = await bcrypt.compare(password, localUser.passwordHash);
  if (!valid) throw new Error("بيانات الدخول غير صحيحة");

  current = {
    id: localUser.id,
    name: localUser.name,
    email: localUser.email,
    role: localUser.role as "ADMIN" | "CASHIER",
  };
  persistSession(current);
  return current;
}

export function logout(): void {
  current = null;
  persistSession(null);
}

export function getCurrentUser(): SessionUser | null {
  return current;
}
