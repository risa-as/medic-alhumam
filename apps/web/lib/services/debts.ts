import { prisma } from "@medic/database";
import { applyDebtPayment, debtRemaining, deriveDebtStatus } from "@medic/core";
import { ApiError } from "../api";

export const debtInclude = {
  customer: { select: { id: true, name: true, phone: true } },
  payments: { orderBy: { createdAt: "desc" } },
  sale: { select: { invoiceNo: true } },
} as const;

/** فاتورة دين مفردة ضمن مجموعة زبون. */
export interface DebtInvoice {
  id: string;
  invoiceNo: string | null;
  amount: number;
  paid: number;
  remaining: number;
  status: "OPEN" | "PARTIAL" | "PAID";
  createdAt: string;
}

/** ديون زبون واحد مُجمّعة: إجماليات + قائمة فواتيره. */
export interface CustomerDebtGroup {
  id: string; // = customerId (مفتاح الصفّ في الجدول)
  customerId: string;
  customerName: string;
  customerPhone: string | null;
  amount: number;
  paid: number;
  remaining: number;
  status: "OPEN" | "PARTIAL" | "PAID";
  invoiceCount: number;
  invoices: DebtInvoice[];
}

/**
 * يعيد الديون **مُجمّعة حسب الزبون**: صفّ واحد لكل زبون يحوي إجمالي مديونيته
 * وقائمة فواتيره، بدل صفّ مستقل لكل فاتورة.
 */
export async function listDebts(
  status?: "OPEN" | "PARTIAL" | "PAID",
  search?: string,
) {
  const statusWhere = status
    ? { status }
    : { status: { in: ["OPEN" as const, "PARTIAL" as const] } };
  const term = search?.trim();
  const searchWhere = term
    ? {
        customer: {
          OR: [
            { name: { contains: term, mode: "insensitive" as const } },
            { phone: { contains: term } },
          ],
        },
      }
    : {};
  const debts = await prisma.debt.findMany({
    where: { ...statusWhere, ...searchWhere },
    orderBy: { createdAt: "desc" },
    take: 500,
    include: debtInclude,
  });

  // تجميع حسب الزبون (المفتاح = معرّف الزبون لتفادي دمج زبائن بنفس الاسم)
  const groups = new Map<string, CustomerDebtGroup & { latestAt: number }>();
  for (const d of debts) {
    const amount = Number(d.amount);
    const paid = Number(d.paid);
    const remaining = debtRemaining(amount, paid);
    const at = d.createdAt.getTime();
    let g = groups.get(d.customer.id);
    if (!g) {
      g = {
        id: d.customer.id,
        customerId: d.customer.id,
        customerName: d.customer.name,
        customerPhone: d.customer.phone,
        amount: 0, paid: 0, remaining: 0,
        status: "OPEN",
        invoiceCount: 0,
        invoices: [],
        latestAt: at,
      };
      groups.set(d.customer.id, g);
    }
    g.amount += amount;
    g.paid += paid;
    g.remaining += remaining;
    g.invoiceCount += 1;
    g.latestAt = Math.max(g.latestAt, at);
    g.invoices.push({
      id: d.id,
      invoiceNo: d.sale?.invoiceNo ?? null,
      amount, paid, remaining,
      status: d.status as "OPEN" | "PARTIAL" | "PAID",
      createdAt: d.createdAt.toISOString(),
    });
  }

  // حالة المجموعة مشتقّة من إجمالي الزبون، وترتيب تنازلي حسب آخر نشاط
  const data: CustomerDebtGroup[] = [...groups.values()]
    .sort((a, b) => b.latestAt - a.latestAt)
    .map(({ latestAt: _latestAt, ...g }) => ({
      ...g,
      status: deriveDebtStatus(g.amount, g.paid),
    }));

  const totalAmount = data.reduce((s, g) => s + g.amount, 0);
  const totalPaid = data.reduce((s, g) => s + g.paid, 0);
  const totalRemaining = data.reduce((s, g) => s + g.remaining, 0);

  return { data, totalAmount, totalPaid, totalRemaining };
}

/**
 * يسجّل دفعة سداد على **حساب الزبون** موزّعةً على ديونه المفتوحة/الجزئية
 * بترتيب الأقدم أولًا (FIFO) ضمن معاملة ذرّية.
 */
export async function recordCustomerDebtPayment(
  customerId: string,
  paymentAmount: number,
  userId: string,
) {
  if (paymentAmount <= 0) {
    throw new ApiError(422, "INVALID_PAYMENT", "مبلغ الدفعة يجب أن يكون أكبر من صفر");
  }
  return prisma.$transaction(
    async (tx) => {
      const debts = await tx.debt.findMany({
        where: { customerId, status: { in: ["OPEN", "PARTIAL"] } },
        orderBy: { createdAt: "asc" },
      });
      if (debts.length === 0) {
        throw new ApiError(404, "NO_OPEN_DEBTS", "لا توجد ديون مفتوحة لهذا الزبون");
      }
      const totalRemaining = debts.reduce(
        (s, d) => s + debtRemaining(Number(d.amount), Number(d.paid)),
        0,
      );
      if (paymentAmount > totalRemaining) {
        throw new ApiError(422, "INVALID_PAYMENT", "المبلغ أكبر من إجمالي المتبقّي على الزبون");
      }

      let left = paymentAmount;
      let affected = 0;
      for (const debt of debts) {
        if (left <= 0) break;
        const rem = debtRemaining(Number(debt.amount), Number(debt.paid));
        if (rem <= 0) continue;
        const pay = Math.min(left, rem);
        const result = applyDebtPayment(Number(debt.amount), Number(debt.paid), pay);
        await tx.debtPayment.create({ data: { debtId: debt.id, amount: pay, userId } });
        await tx.debt.update({
          where: { id: debt.id },
          data: { paid: result.paid, status: result.status },
        });
        left -= pay;
        affected += 1;
      }

      return { ok: true, applied: paymentAmount - left, debtsAffected: affected };
    },
    { maxWait: 15000, timeout: 30000 },
  );
}

/** يسجّل دفعة سداد ويحدّث الدين ضمن معاملة ذرّية. */
export async function recordDebtPayment(
  debtId: string,
  paymentAmount: number,
  userId: string,
) {
  return prisma.$transaction(
    async (tx) => {
      const debt = await tx.debt.findUnique({ where: { id: debtId } });
      if (!debt) throw new ApiError(404, "DEBT_NOT_FOUND", "الدين غير موجود");
      if (debt.status === "PAID") throw new ApiError(409, "DEBT_ALREADY_PAID", "هذا الدين مسدّد بالفعل");

      let result;
      try {
        result = applyDebtPayment(Number(debt.amount), Number(debt.paid), paymentAmount);
      } catch (e) {
        throw new ApiError(422, "INVALID_PAYMENT", e instanceof Error ? e.message : "دفعة غير صالحة");
      }

      const [payment, updatedDebt] = await Promise.all([
        tx.debtPayment.create({
          data: { debtId, amount: paymentAmount, userId },
        }),
        tx.debt.update({
          where: { id: debtId },
          data: { paid: result.paid, status: result.status },
          include: debtInclude,
        }),
      ]);

      return {
        payment: { ...payment, amount: Number(payment.amount) },
        debt: {
          ...updatedDebt,
          amount: Number(updatedDebt.amount),
          paid: Number(updatedDebt.paid),
          remaining: result.remaining,
          payments: updatedDebt.payments.map((p) => ({ ...p, amount: Number(p.amount) })),
        },
      };
    },
    { maxWait: 15000, timeout: 30000 },
  );
}
