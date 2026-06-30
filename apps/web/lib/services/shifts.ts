import { prisma, Prisma } from "@medic/database";
import { computeShiftTotals, type ShiftSyncEvent, type SalePlatform } from "@medic/core";
import { ApiError } from "../api";

/** الحقول المختصرة لفواتير الوردية المستخدمة في حساب الإجماليات. */
const shiftSaleSelect = {
  total: true,
  paid: true,
  remaining: true,
  discount: true,
  paymentMethod: true,
} satisfies Prisma.SaleSelect;

type ShiftRow = {
  userId: string;
  openingFloat: Prisma.Decimal;
  closingCountedCash: Prisma.Decimal | null;
  [k: string]: unknown;
};

type ShiftSaleRow = {
  total: Prisma.Decimal;
  paid: Prisma.Decimal;
  remaining: Prisma.Decimal;
  discount: Prisma.Decimal;
  paymentMethod: string | null;
};

/** يحوّل وردية + فواتيرها إلى كائن عرض بأرقام JS وإجماليات محسوبة موحّدة. */
function serializeShift(shift: ShiftRow, sales: ShiftSaleRow[]) {
  const openingFloat = Number(shift.openingFloat);
  const closing = shift.closingCountedCash == null ? null : Number(shift.closingCountedCash);
  const totals = computeShiftTotals(
    sales.map((s) => ({
      total: Number(s.total),
      paid: Number(s.paid),
      remaining: Number(s.remaining),
      discount: Number(s.discount),
      paymentMethod: s.paymentMethod,
    })),
    openingFloat,
    closing,
  );
  return {
    ...shift,
    openingFloat,
    closingCountedCash: closing,
    totals,
  };
}

const userSelect = { select: { id: true, name: true } } as const;

/** الوردية المفتوحة الحالية للمستخدم (إن وُجدت) مع إجمالياتها الجارية. */
export async function getCurrentOpenShift(userId: string) {
  const shift = await prisma.shift.findFirst({
    where: { userId, status: "OPEN" },
    orderBy: { openedAt: "desc" },
    include: { sales: { select: shiftSaleSelect }, user: userSelect },
  });
  if (!shift) return null;
  const { sales, ...rest } = shift;
  return serializeShift(rest, sales);
}

/** يفتح وردية للمستخدم. إن كانت لديه وردية مفتوحة يُعيدها (استئناف) لتفادي التكرار. */
export async function openShift(
  userId: string,
  input: { openingFloat?: number; note?: string; platform?: SalePlatform },
) {
  const existing = await getCurrentOpenShift(userId);
  if (existing) return existing;
  const created = await prisma.shift.create({
    data: {
      userId,
      platform: input.platform ?? "POS_MOBILE",
      openingFloat: input.openingFloat ?? 0,
      note: input.note ?? null,
      status: "OPEN",
    },
    include: { user: userSelect },
  });
  return serializeShift(created, []);
}

/** يغلق وردية بعدّ النقد الفعلي (المالك أو صاحب الوردية). */
export async function closeShift(
  id: string,
  userId: string,
  role: string,
  input: { closingCountedCash: number; note?: string },
) {
  const shift = await prisma.shift.findUnique({ where: { id } });
  if (!shift) throw new ApiError(404, "SHIFT_NOT_FOUND", "الوردية غير موجودة");
  if (role !== "ADMIN" && shift.userId !== userId) {
    throw new ApiError(403, "FORBIDDEN", "لا تملك صلاحية إغلاق هذه الوردية");
  }
  if (shift.status === "CLOSED") throw new ApiError(409, "SHIFT_CLOSED", "الوردية مغلقة مسبقًا");
  await prisma.shift.update({
    where: { id },
    data: {
      status: "CLOSED",
      closingCountedCash: input.closingCountedCash,
      closedAt: new Date(),
      ...(input.note !== undefined ? { note: input.note } : {}),
    },
  });
  return getShiftDetail(id);
}

/** تفاصيل وردية واحدة مع الإجماليات وقائمة فواتيرها (للتقارير والعرض). */
export async function getShiftDetail(id: string) {
  const shift = await prisma.shift.findUnique({
    where: { id },
    include: {
      user: userSelect,
      sales: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          invoiceNo: true,
          total: true,
          paid: true,
          remaining: true,
          discount: true,
          paymentType: true,
          paymentMethod: true,
          customerName: true,
          createdAt: true,
        },
      },
    },
  });
  if (!shift) throw new ApiError(404, "SHIFT_NOT_FOUND", "الوردية غير موجودة");
  const { sales, ...rest } = shift;
  const base = serializeShift(rest, sales);
  return {
    ...base,
    sales: sales.map((s) => ({
      ...s,
      total: Number(s.total),
      paid: Number(s.paid),
      remaining: Number(s.remaining),
      discount: Number(s.discount),
    })),
  };
}

export interface ShiftListFilter {
  from?: Date;
  to?: Date;
  userId?: string;
  status?: "OPEN" | "CLOSED";
}

/** قائمة الورديات (للمالك في التقارير) مع إجماليات كل وردية. */
export async function listShifts(filter: ShiftListFilter) {
  const where: Prisma.ShiftWhereInput = {};
  if (filter.userId) where.userId = filter.userId;
  if (filter.status) where.status = filter.status;
  if (filter.from || filter.to) {
    where.openedAt = {
      ...(filter.from ? { gte: filter.from } : {}),
      ...(filter.to ? { lt: filter.to } : {}),
    };
  }
  const shifts = await prisma.shift.findMany({
    where,
    orderBy: { openedAt: "desc" },
    take: 200,
    include: { user: userSelect, sales: { select: shiftSaleSelect } },
  });
  return shifts.map(({ sales, ...rest }) => serializeShift(rest, sales));
}

/**
 * يسجّل حدث وردية وارد من مزامنة الديسكتوب (idempotent عبر clientEventId):
 * فتح ⇒ إنشاء، إغلاق ⇒ تحديث. يُرجع معرّف الوردية على الخادم لربط الفواتير.
 */
export async function recordSyncedShift(
  event: ShiftSyncEvent,
  fallbackUserId: string,
): Promise<{ shiftClientEventId: string; eventKey: string; shiftId: string }> {
  let userId = fallbackUserId;
  if (event.userId) {
    const u = await prisma.user.findUnique({ where: { id: event.userId }, select: { id: true } });
    if (u) userId = u.id;
  }
  const closingFields =
    event.status === "CLOSED"
      ? {
          status: "CLOSED" as const,
          closingCountedCash: event.closingCountedCash ?? null,
          closedAt: event.closedAt ? new Date(event.closedAt) : new Date(),
          note: event.note ?? null,
        }
      : { status: "OPEN" as const };

  const shift = await prisma.shift.upsert({
    where: { clientEventId: event.clientEventId },
    create: {
      clientEventId: event.clientEventId,
      userId,
      platform: "POS_DESKTOP",
      openingFloat: event.openingFloat ?? 0,
      openedAt: new Date(event.openedAt),
      ...(event.note != null ? { note: event.note } : {}),
      ...closingFields,
    },
    update: closingFields,
    select: { id: true },
  });
  return {
    shiftClientEventId: event.clientEventId,
    eventKey: event.eventKey ?? event.clientEventId,
    shiftId: shift.id,
  };
}

/** يحوّل clientEventId لوردية إلى معرّفها على الخادم (لربط فواتير الديسكتوب). */
export async function resolveShiftIdByClientEvent(clientEventId: string): Promise<string | null> {
  const shift = await prisma.shift.findUnique({
    where: { clientEventId },
    select: { id: true },
  });
  return shift?.id ?? null;
}
