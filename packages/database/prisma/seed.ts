// بذرة البيانات الأولية: فئات + مستخدم ADMIN + صف Setting (Phase 2 / T008).
import bcrypt from "bcryptjs";
import { prisma } from "../src/index";

const CATEGORIES = ["عكازات", "كراسي متحركة", "مقاعد طبية", "أحزمة طبية", "مستلزمات عامة"];

async function main() {
  // الفئات
  for (const nameAr of CATEGORIES) {
    await prisma.category.upsert({
      where: { nameAr },
      update: {},
      create: { nameAr },
    });
  }
  console.log(`✔ الفئات: ${CATEGORIES.length}`);

  // مستخدم المدير الافتراضي
  const adminEmail = "admin@medic.local";
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "المدير",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`✔ مستخدم ADMIN: ${adminEmail} (كلمة المرور المبدئية: admin123)`);

  // منتجات عيّنة (لتجربة نقطة البيع والمتجر)
  const catByName = new Map(
    (await prisma.category.findMany()).map((c) => [c.nameAr, c.id]),
  );
  const sampleProducts = [
    { nameAr: "عكاز طبي قابل للطي", sku: "CRUTCH-001", cat: "عكازات", cost: 9000, sale: 15000, qty: 50, min: 10 },
    { nameAr: "كرسي متحرك قياسي", sku: "WCHAIR-001", cat: "كراسي متحركة", cost: 90000, sale: 120000, qty: 10, min: 3 },
    { nameAr: "حزام ظهر طبي", sku: "BELT-001", cat: "أحزمة طبية", cost: 16000, sale: 25000, qty: 30, min: 8, online: true },
  ];
  for (const p of sampleProducts) {
    const categoryId = catByName.get(p.cat);
    if (!categoryId) continue;
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        nameAr: p.nameAr,
        sku: p.sku,
        categoryId,
        costPrice: p.cost,
        salePrice: p.sale,
        quantity: p.qty,
        minQuantity: p.min,
        isOnline: p.online ?? false,
      },
    });
  }
  console.log(`✔ منتجات العيّنة: ${sampleProducts.length}`);

  // صف الإعدادات المفرد
  const existingSetting = await prisma.setting.findFirst();
  if (!existingSetting) {
    await prisma.setting.create({
      data: { storeName: "متجر المستلزمات الطبية", currency: "IQD" },
    });
    console.log("✔ صف الإعدادات أُنشئ");
  } else {
    console.log("• صف الإعدادات موجود مسبقًا");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("تمت البذرة بنجاح.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
