import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@medic/database";
import { z } from "zod";
import { handleRoute, parseBody } from "@/lib/api";
import { requireRole, requireUser } from "@/lib/rbac";

const settingUpdateSchema = z.object({
  storeName: z.string().min(1).optional(),
  logoUrl: z.string().url().nullable().optional(),
  currency: z.string().min(1).max(10).optional(),
  printerConfig: z.record(z.unknown()).optional(),
  // أسعار التوصيل الفعلية القابلة للتغيير (بغداد مقابل بقية المحافظات).
  deliveryCostBaghdad: z.number().nonnegative().optional(),
  deliveryCostOther: z.number().nonnegative().optional(),
});

async function getOrCreateSetting() {
  const existing = await prisma.setting.findFirst();
  if (existing) return existing;
  return prisma.setting.create({ data: {} });
}

export function GET() {
  return handleRoute(async () => {
    await requireUser();
    const setting = await getOrCreateSetting();
    return NextResponse.json({
      ...setting,
      printerConfig: setting.printerConfig,
      deliveryCostBaghdad: Number(setting.deliveryCostBaghdad),
      deliveryCostOther: Number(setting.deliveryCostOther),
    });
  });
}

export function PATCH(req: Request) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const input = await parseBody(req, settingUpdateSchema);
    const setting = await getOrCreateSetting();
    const updated = await prisma.setting.update({
      where: { id: setting.id },
      data: {
        ...(input.storeName !== undefined && { storeName: input.storeName }),
        ...(input.logoUrl !== undefined && { logoUrl: input.logoUrl }),
        ...(input.currency !== undefined && { currency: input.currency }),
        ...(input.printerConfig !== undefined && { printerConfig: input.printerConfig as never }),
        ...(input.deliveryCostBaghdad !== undefined && { deliveryCostBaghdad: input.deliveryCostBaghdad }),
        ...(input.deliveryCostOther !== undefined && { deliveryCostOther: input.deliveryCostOther }),
      },
    });
    // إبطال كاش إعدادات المتجر فيظهر التغيير فورًا في واجهة المتجر.
    revalidateTag("settings");
    return NextResponse.json({
      ...updated,
      deliveryCostBaghdad: Number(updated.deliveryCostBaghdad),
      deliveryCostOther: Number(updated.deliveryCostOther),
    });
  });
}
