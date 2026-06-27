import { prisma } from "@medic/database";
import { Prisma } from "@medic/database";
import { debtRemaining } from "@medic/core";

/** يحسب رصيد الزبون (مجموع الديون المفتوحة/الجزئية). */
export async function getCustomerBalance(customerId: string): Promise<number> {
  const result = await prisma.debt.aggregate({
    where: { customerId, status: { in: ["OPEN", "PARTIAL"] } },
    _sum: { amount: true, paid: true },
  });
  const total = Number(result._sum.amount ?? 0);
  const paid = Number(result._sum.paid ?? 0);
  return debtRemaining(total, paid);
}

/** يعيد الزبون مع ملخص رصيده وآخر معاملاته. */
export async function getCustomerWithSummary(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      debts: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { payments: { orderBy: { createdAt: "desc" } } },
      },
      sales: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, invoiceNo: true, total: true, paymentType: true, createdAt: true },
      },
    },
  });
  if (!customer) return null;

  const [balance, salesAgg] = await Promise.all([
    getCustomerBalance(id),
    prisma.sale.aggregate({
      where: { customerId: id },
      _sum: { total: true },
      _count: { _all: true },
    }),
  ]);

  return {
    ...customer,
    balance,
    salesCount: salesAgg._count._all,
    salesTotal: Number(salesAgg._sum.total ?? 0),
    debts: customer.debts.map(serializeDebt),
    sales: customer.sales.map((s) => ({ ...s, total: Number(s.total) })),
  };
}

/**
 * كشف حساب الزبون: قيود زمنية تجمع الديون (مدين) ودفعات السداد (دائن)
 * مع رصيد جارٍ، إضافة إلى الإجماليات.
 */
export async function getCustomerStatement(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { id: true, name: true, phone: true, address: true, createdAt: true },
  });
  if (!customer) return null;

  const debts = await prisma.debt.findMany({
    where: { customerId },
    orderBy: { createdAt: "asc" },
    include: {
      sale: { select: { invoiceNo: true } },
      payments: { orderBy: { createdAt: "asc" } },
    },
  });

  type Entry = {
    id: string;
    date: Date;
    type: "DEBT" | "PAYMENT";
    description: string;
    debit: number; // مبلغ الدين المستحق
    credit: number; // مبلغ التسديد
  };

  const entries: Entry[] = [];
  for (const d of debts) {
    const ref = d.sale?.invoiceNo ? `فاتورة ${d.sale.invoiceNo}` : "دين";
    entries.push({
      id: `debt-${d.id}`,
      date: d.createdAt,
      type: "DEBT",
      description: ref,
      debit: Number(d.amount),
      credit: 0,
    });
    for (const p of d.payments) {
      entries.push({
        id: `pay-${p.id}`,
        date: p.createdAt,
        type: "PAYMENT",
        description: d.sale?.invoiceNo ? `سداد فاتورة ${d.sale.invoiceNo}` : "دفعة سداد",
        debit: 0,
        credit: Number(p.amount),
      });
    }
  }

  entries.sort((a, b) => a.date.getTime() - b.date.getTime());

  let balance = 0;
  const ledger = entries.map((e) => {
    balance += e.debit - e.credit;
    return {
      id: e.id,
      date: e.date,
      type: e.type,
      description: e.description,
      debit: e.debit,
      credit: e.credit,
      balance,
    };
  });

  const totalDebt = ledger.reduce((s, e) => s + e.debit, 0);
  const totalPaid = ledger.reduce((s, e) => s + e.credit, 0);

  return {
    customer,
    ledger,
    totalDebt,
    totalPaid,
    totalRemaining: debtRemaining(totalDebt, totalPaid),
  };
}

export function serializeDebt(
  debt: Prisma.DebtGetPayload<{
    include: { payments: { orderBy: { createdAt: "desc" } } };
  }>,
) {
  const amount = Number(debt.amount);
  const paid = Number(debt.paid);
  return {
    ...debt,
    amount,
    paid,
    remaining: debtRemaining(amount, paid),
    payments: debt.payments.map((p) => ({ ...p, amount: Number(p.amount) })),
  };
}
