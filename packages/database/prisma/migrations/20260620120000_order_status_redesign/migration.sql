-- إعادة تصميم حالات الطلب:
--   NEW / PROCESSING / SHIPPED  →  PENDING (معلق)
--   COMPLETED (مكتمل) و CANCELLED (الغاء) تبقى كما هي
--   إضافة: RETURNED (راجع) و DELETED (حذف)
-- ملاحظة: تغيير قيم enum في PostgreSQL يتطلّب إنشاء نوع جديد ونقل البيانات إليه.

BEGIN;

-- 1) نوع enum جديد بالقيم المطلوبة
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'COMPLETED', 'RETURNED', 'CANCELLED', 'DELETED');

-- 2) إزالة القيمة الافتراضية قبل تغيير نوع العمود
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;

-- 3) تحويل العمود مع تعيين القيم القديمة إلى الجديدة
ALTER TABLE "Order"
  ALTER COLUMN "status" TYPE "OrderStatus_new"
  USING (
    CASE "status"::text
      WHEN 'NEW'        THEN 'PENDING'
      WHEN 'PROCESSING' THEN 'PENDING'
      WHEN 'SHIPPED'    THEN 'PENDING'
      WHEN 'COMPLETED'  THEN 'COMPLETED'
      WHEN 'CANCELLED'  THEN 'CANCELLED'
      ELSE 'PENDING'
    END
  )::"OrderStatus_new";

-- 4) استبدال النوع القديم بالجديد
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";

-- 5) إعادة القيمة الافتراضية
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';

COMMIT;
