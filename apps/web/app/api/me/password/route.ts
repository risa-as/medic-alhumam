import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { handleRoute, parseBody, ApiError } from "@/lib/api";
import { requireUser } from "@/lib/rbac";

/** المستخدم يغيّر كلمة مروره بنفسه بعد التحقق من الكلمة الحالية. */
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
  newPassword: z.string().min(6, "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل"),
});

export function PATCH(req: Request) {
  return handleRoute(async () => {
    const sessionUser = await requireUser();
    const id = (sessionUser as { id?: string }).id;
    const input = await parseBody(req, passwordSchema);

    const user = await prisma.user.findUnique({
      where: { id },
      select: { passwordHash: true },
    });
    if (!user) throw new ApiError(404, "NOT_FOUND", "المستخدم غير موجود");

    const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
    if (!valid) throw new ApiError(400, "INVALID_PASSWORD", "كلمة المرور الحالية غير صحيحة");

    const same = await bcrypt.compare(input.newPassword, user.passwordHash);
    if (same) throw new ApiError(400, "SAME_PASSWORD", "كلمة المرور الجديدة مطابقة للحالية");

    const passwordHash = await bcrypt.hash(input.newPassword, 10);
    await prisma.user.update({ where: { id }, data: { passwordHash } });

    return NextResponse.json({ ok: true });
  });
}
