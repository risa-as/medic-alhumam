import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { handleRoute, parseBody } from "@/lib/api";
import { requireRole } from "@/lib/rbac";

const userCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "CASHIER"]).default("CASHIER"),
});

function safeUser(u: { id: string; name: string; email: string; role: string; createdAt: Date }) {
  return { id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt };
}

export function GET() {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ data: users.map(safeUser) });
  });
}

export function POST(req: Request) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const input = await parseBody(req, userCreateSchema);
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
      data: { name: input.name, email: input.email, passwordHash, role: input.role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return NextResponse.json(safeUser(user), { status: 201 });
  });
}
