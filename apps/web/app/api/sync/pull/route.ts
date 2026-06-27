import { NextResponse } from "next/server";
import { prisma } from "@medic/database";
import { debtRemaining } from "@medic/core";
import { handleRoute } from "@/lib/api";
import { requireSyncAuth } from "@/lib/sync-auth";

/** يعيد المنتجات المُحدَّثة منذ الطابع الزمني `since` لمزامنتها محليًا في الديسكتوب. */
export function GET(req: Request) {
  return handleRoute(async () => {
    requireSyncAuth(req);
    const since = new URL(req.url).searchParams.get("since");
    const where = since ? { updatedAt: { gt: new Date(since) } } : {};

    const products = await prisma.product.findMany({
      where,
      orderBy: { updatedAt: "asc" },
      select: {
        id: true,
        nameAr: true,
        sku: true,
        salePrice: true,
        quantity: true,
        minQuantity: true,
        isOnline: true,
        updatedAt: true,
      },
    });

    // المستخدمون لتسجيل الدخول الأوفلاين على الديسكتوب (FR-052) — محميّ بـ SYNC_SECRET (ثقة الجهاز)
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, passwordHash: true, role: true },
    });

    // الزبائن — مرآة محلية في الديسكتوب لبحث/إكمال نقطة البيع دون اتصال.
    // يُسحَب الزبائن كاملين (لا updatedAt على الزبون)، مع رصيد الدين المفتوح/الجزئي لكلٍّ.
    const customers = await prisma.customer.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, phone: true, address: true },
    });
    const debtAgg = await prisma.debt.groupBy({
      by: ["customerId"],
      where: { status: { in: ["OPEN", "PARTIAL"] } },
      _sum: { amount: true, paid: true },
    });
    const balanceByCustomer = new Map(
      debtAgg.map((d) => [d.customerId, debtRemaining(Number(d._sum.amount ?? 0), Number(d._sum.paid ?? 0))]),
    );

    return NextResponse.json({
      serverTime: new Date().toISOString(),
      products: products.map((p) => ({ ...p, salePrice: Number(p.salePrice) })),
      users,
      customers: customers.map((c) => ({ ...c, balance: balanceByCustomer.get(c.id) ?? 0 })),
    });
  });
}
