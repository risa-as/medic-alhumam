import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { handleRoute, parseBody, ApiError } from "@/lib/api";
import { signClientToken } from "@/lib/jwt";

const tokenSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * تسجيل دخول العملاء غير-المتصفح (الديسكتوب/الهاتف) — FR-046.
 * يتحقق بـ bcrypt ويُصدر JWT يحمل userId والدور.
 */
export function POST(req: Request) {
  return handleRoute(async () => {
    const { email, password } = await parseBody(req, tokenSchema);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ApiError(401, "INVALID_CREDENTIALS", "بيانات الدخول غير صحيحة");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new ApiError(401, "INVALID_CREDENTIALS", "بيانات الدخول غير صحيحة");

    const token = await signClientToken({ sub: user.id, role: user.role });
    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  });
}
