import { NextResponse } from "next/server";
import { prisma, Prisma } from "@medic/database";
import { saleCreateSchema } from "@medic/core";
import { z } from "zod";
import { handleRoute, parseBody } from "@/lib/api";
import { requireRole } from "@/lib/rbac";
import { createSaleAuthoritative, saleInclude } from "@/lib/services/sales";

const createSchema = saleCreateSchema.extend({
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  platform: z.enum(["POS_MOBILE", "WEB"]).optional(),
});

export function POST(req: Request) {
  return handleRoute(async () => {
    const user = await requireRole("ADMIN", "CASHIER");
    const input = await parseBody(req, createSchema);
    const sale = await createSaleAuthoritative(input, user.id, input.platform ?? "WEB");
    return NextResponse.json(sale, { status: 201 });
  });
}

export function GET(req: Request) {
  return handleRoute(async () => {
    const user = await requireRole("ADMIN", "CASHIER");
    const sp = new URL(req.url).searchParams;
    const mine = sp.get("mine") === "1";
    const period = sp.get("period");          // today | undefined
    const invoiceNo = sp.get("invoiceNo")?.trim();
    const from = sp.get("from");              // ISO، شامل (gte)
    const to = sp.get("to");                  // ISO، غير شامل (lt)
    const limitParam = parseInt(sp.get("limit") ?? "", 10);
    const take = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 500) : 500;

    const where: Prisma.SaleWhereInput = {};
    if (mine) where.userId = user.id;
    if (invoiceNo) where.invoiceNo = { contains: invoiceNo };

    // نطاق زمني صريح [from, to) له الأولوية، وإلا فلتر «اليوم» القديم
    if (from || to) {
      where.createdAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lt: new Date(to) } : {}),
      };
    } else if (period === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      where.createdAt = { gte: start, lte: end };
    }

    const sales = await prisma.sale.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      include: saleInclude,
    });
    const data = sales.map(serializeSale);
    const totalRevenue = data.reduce((sum, s) => sum + s.total, 0);
    return NextResponse.json({ data, count: data.length, totalRevenue });
  });
}

/** يحوّل حقول Decimal إلى أرقام JS للعرض في الواجهة (نفس نهج الطلبات). */
function serializeSale(s: {
  subtotal: unknown; discount: unknown; total: unknown; paid: unknown; remaining: unknown;
  items: Array<{ unitPrice: unknown; lineDiscount: unknown; lineTotal: unknown; costTotal: unknown; [k: string]: unknown }>;
  [k: string]: unknown;
}) {
  return {
    ...s,
    subtotal: Number(s.subtotal),
    discount: Number(s.discount),
    total: Number(s.total),
    paid: Number(s.paid),
    remaining: Number(s.remaining),
    items: s.items.map((i) => ({
      ...i,
      unitPrice: Number(i.unitPrice),
      lineDiscount: Number(i.lineDiscount),
      lineTotal: Number(i.lineTotal),
      costTotal: i.costTotal == null ? null : Number(i.costTotal),
    })),
  };
}
