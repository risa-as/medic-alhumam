-- إضافة منظومة أسعار التوصيل:
--   Product.deliveryPrice        → سعر التوصيل المعروض للزبون (بجانب سعر المنتج)
--   Order.actualDeliveryCost     → تكلفة التوصيل الفعلية (لقطة لحظية حسب المحافظة)
--   Order.notes                  → ملاحظات إدارية على الطلب
--   Setting.deliveryCostBaghdad  → سعر التوصيل الفعلي لبغداد (قابل للتغيير)
--   Setting.deliveryCostOther    → سعر التوصيل الفعلي لبقية المحافظات (قابل للتغيير)

BEGIN;

ALTER TABLE "Product"
  ADD COLUMN "deliveryPrice" DECIMAL(14,3) NOT NULL DEFAULT 0;

ALTER TABLE "Order"
  ADD COLUMN "actualDeliveryCost" DECIMAL(14,3),
  ADD COLUMN "notes" TEXT;

ALTER TABLE "Setting"
  ADD COLUMN "deliveryCostBaghdad" DECIMAL(14,3) NOT NULL DEFAULT 4000,
  ADD COLUMN "deliveryCostOther"   DECIMAL(14,3) NOT NULL DEFAULT 6000;

COMMIT;
