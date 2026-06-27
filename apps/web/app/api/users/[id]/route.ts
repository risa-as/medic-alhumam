import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { handleRoute, parseBody, ApiError } from "@/lib/api";
import { requireRole } from "@/lib/rbac";

const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(["ADMIN", "CASHIER"]).optional(),
  password: z.string().min(6).optional(),
});

export function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const actor = await requireRole("ADMIN");
    const { id } = await params;
    const input = await parseBody(req, userUpdateSchema);

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) throw new ApiError(404, "NOT_FOUND", "المستخدم غير موجود");

    // منع تخفيض الدور إذا كان المستخدم الوحيد بدور ADMIN
    if (input.role && input.role !== "ADMIN" && target.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) throw new ApiError(400, "LAST_ADMIN", "لا يمكن تغيير دور المدير الوحيد");
    }

    const data: Record<string, unknown> = {};
    if (input.name) data.name = input.name;
    if (input.email) data.email = input.email;
    if (input.role) data.role = input.role;
    if (input.password) data.passwordHash = await bcrypt.hash(input.password, 10);

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    void actor; // suppress unused warning
    return NextResponse.json(updated);
  });
}

export function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const actor = await requireRole("ADMIN");
    const { id } = await params;

    if ((actor as { id?: string }).id === id)
      throw new ApiError(400, "SELF_DELETE", "لا يمكنك حذف حسابك بنفسك");

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) throw new ApiError(404, "NOT_FOUND", "المستخدم غير موجود");

    if (target.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) throw new ApiError(400, "LAST_ADMIN", "لا يمكن حذف المدير الوحيد");
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  });
}
