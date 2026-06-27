import { prisma, Prisma } from "@medic/database";
import type { ExpenseCreateInput, ExpenseUpdateInput } from "@medic/core";

const expenseSelect = {
  id: true,
  amount: true,
  category: true,
  note: true,
  spentAt: true,
  createdAt: true,
  user: { select: { name: true } },
} satisfies Prisma.ExpenseSelect;

type ExpenseRow = Prisma.ExpenseGetPayload<{ select: typeof expenseSelect }>;

function serialize(e: ExpenseRow) {
  return { ...e, amount: Number(e.amount) };
}

export async function listExpenses(opts: { from?: Date; to?: Date } = {}) {
  const where: Prisma.ExpenseWhereInput = {};
  if (opts.from || opts.to) {
    where.spentAt = {
      ...(opts.from && { gte: opts.from }),
      ...(opts.to && { lte: opts.to }),
    };
  }
  const rows = await prisma.expense.findMany({
    where,
    orderBy: { spentAt: "desc" },
    take: 500,
    select: expenseSelect,
  });
  const data = rows.map(serialize);
  return { data, total: data.reduce((s, e) => s + e.amount, 0) };
}

export async function createExpense(input: ExpenseCreateInput, userId: string) {
  const e = await prisma.expense.create({
    data: {
      amount: input.amount,
      category: input.category,
      note: input.note?.trim() || null,
      spentAt: input.spentAt ? new Date(input.spentAt) : undefined,
      userId,
    },
    select: expenseSelect,
  });
  return serialize(e);
}

export async function updateExpense(id: string, input: ExpenseUpdateInput) {
  const e = await prisma.expense.update({
    where: { id },
    data: {
      ...(input.amount !== undefined && { amount: input.amount }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.note !== undefined && { note: input.note?.trim() || null }),
      ...(input.spentAt !== undefined && { spentAt: new Date(input.spentAt) }),
    },
    select: expenseSelect,
  });
  return serialize(e);
}

export async function deleteExpense(id: string) {
  await prisma.expense.delete({ where: { id } });
}

/** إجمالي المصاريف ضمن فترة + تفصيلها حسب الفئة. */
export async function getExpensesSummary(from: Date, to: Date) {
  const grouped = await prisma.expense.groupBy({
    by: ["category"],
    where: { spentAt: { gte: from, lte: to } },
    _sum: { amount: true },
  });
  const byCategory = grouped
    .map((g) => ({ category: g.category as string, amount: Number(g._sum.amount ?? 0) }))
    .sort((a, b) => b.amount - a.amount);
  return { total: byCategory.reduce((s, c) => s + c.amount, 0), byCategory };
}
