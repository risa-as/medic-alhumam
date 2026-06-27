import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { z } from "zod";
import { handleRoute, parseBody, ApiError } from "@/lib/api";
import { requireUser } from "@/lib/rbac";

/** تعديل الاسم فقط — أي حقل آخر (email/role/password) يُرفض ضمنيًا بعدم قراءته. */
const meUpdateSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
});

/** بيانات المستخدم المصادق الحالي. */
export function GET() {
  return handleRoute(async () => {
    const sessionUser = await requireUser();
    const user = await prisma.user.findUnique({
      where: { id: (sessionUser as { id?: string }).id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user) throw new ApiError(404, "NOT_FOUND", "المستخدم غير موجود");
    return NextResponse.json(user);
  });
}

/** يعدّل المستخدم اسمه فقط (FR-042). */
export function PATCH(req: Request) {
  return handleRoute(async () => {
    const sessionUser = await requireUser();
    const input = await parseBody(req, meUpdateSchema);
    const user = await prisma.user.update({
      where: { id: (sessionUser as { id?: string }).id },
      data: { name: input.name },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return NextResponse.json(user);
  });
}
