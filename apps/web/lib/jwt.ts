import { SignJWT, jwtVerify } from "jose";

/**
 * توكنات JWT للعملاء غير-المتصفح (الديسكتوب/الهاتف) — FR-046.
 * موقّعة بـ HS256 بنفس سرّ Auth.js (AUTH_SECRET) لتوحيد المصادقة.
 */
const ISSUER = "medic";
const AUDIENCE = "medic-clients";

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET غير مُهيّأ");
  return new TextEncoder().encode(secret);
}

export interface MedicTokenPayload {
  sub: string; // userId
  role: "ADMIN" | "CASHIER";
}

/** يُصدر JWT يحمل userId والدور، صالحًا 30 يومًا. */
export async function signClientToken(payload: MedicTokenPayload): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey());
}

/** يتحقق من JWT ويُعيد الحمولة، أو null عند الفشل/الانتهاء. */
export async function verifyClientToken(token: string): Promise<MedicTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (!payload.sub || (payload.role !== "ADMIN" && payload.role !== "CASHIER")) return null;
    return { sub: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}
