-- إضافة حالة "الرئيسية" (HOME) كحالة افتراضية للطلبات الواردة الجديدة:
--   HOME (الرئيسية)  → الطلبات الجديدة تبدأ هنا بدل PENDING (معلق).
--   PENDING (معلق)   → يبقى كحالة تُطبَّق يدويًّا من الإدارة عند الحاجة.
-- الطلبات الموجودة حاليًا في "معلق" (PENDING) تُنقَل إلى "الرئيسية" (HOME)
-- لأنها فعليًّا طلبات جديدة واردة (PENDING كان الحالة الافتراضية القديمة).
-- نتبع نمط إنشاء نوع enum جديد والتبديل (آمن داخل معاملة واحدة، خلافًا لـ ALTER TYPE ADD VALUE).

BEGIN;

-- 1) نوع enum جديد يضم HOME
CREATE TYPE "OrderStatus_new" AS ENUM ('HOME', 'PENDING', 'COMPLETED', 'RETURNED', 'CANCELLED', 'DELETED');

-- 2) إزالة القيمة الافتراضية قبل تغيير نوع العمود
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;

-- 3) تحويل العمود مع نقل PENDING الحالية إلى HOME
ALTER TABLE "Order"
  ALTER COLUMN "status" TYPE "OrderStatus_new"
  USING (
    CASE "status"::text
      WHEN 'PENDING' THEN 'HOME'
      ELSE "status"::text
    END
  )::"OrderStatus_new";

-- 4) استبدال النوع القديم بالجديد
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";

-- 5) القيمة الافتراضية الجديدة للطلبات الواردة
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'HOME';

COMMIT;
