import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { customerCreateSchema } from "@medic/core";
import { handleRoute, parseBody } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { getCustomerBalance } from "@/lib/services/customers";

export function GET(req: Request) {
  return handleRoute(async () => {
    await requireRole("ADMIN", "CASHIER");
    const q = new URL(req.url).searchParams.get("q") ?? undefined;
    const customers = await prisma.customer.findMany({
      where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }, { address: { contains: q, mode: "insensitive" } }] } : undefined,
      orderBy: { name: "asc" },
      take: 100,
    });
    // أضف الرصيد لكل زبون
    const data = await Promise.all(
      customers.map(async (c) => ({ ...c, balance: await getCustomerBalance(c.id) })),
    );
    return NextResponse.json({ data });
  });
}

export function POST(req: Request) {
  return handleRoute(async () => {
    await requireRole("ADMIN", "CASHIER");
    const input = await parseBody(req, customerCreateSchema);
    const customer = await prisma.customer.create({ data: input });
    return NextResponse.json(customer, { status: 201 });
  });
}
