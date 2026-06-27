-- AlterTable: تكلفة البضاعة المباعة لكل سطر فاتورة (FEFO). null للفواتير القديمة.
ALTER TABLE "SaleItem" ADD COLUMN     "costTotal" DECIMAL(14,3);

-- CreateTable: دفعات المخزون (الشحنات) — أساس حساب التكلفة بنظام FEFO
CREATE TABLE "ProductBatch" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "costPrice" DECIMAL(14,3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "remaining" INTEGER NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductBatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductBatch_productId_idx" ON "ProductBatch"("productId");

-- CreateIndex
CREATE INDEX "ProductBatch_expiryDate_idx" ON "ProductBatch"("expiryDate");

-- CreateIndex
CREATE INDEX "ProductBatch_productId_remaining_idx" ON "ProductBatch"("productId", "remaining");

-- AddForeignKey
ALTER TABLE "ProductBatch" ADD CONSTRAINT "ProductBatch_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Data backfill: دفعة أولية واحدة لكل منتج له مخزون حالي، بسعر شرائه الحالي.
-- يجعل المخزون القائم مُسعّرًا فورًا حتى تبدأ شحنات FEFO الجديدة.
INSERT INTO "ProductBatch" ("id", "productId", "costPrice", "quantity", "remaining", "receivedAt", "reason", "createdAt")
SELECT
    gen_random_uuid()::text,
    "id",
    "costPrice",
    "quantity",
    "quantity",
    "createdAt",
    'رصيد افتتاحي عند تفعيل تتبّع الدفعات',
    CURRENT_TIMESTAMP
FROM "Product"
WHERE "quantity" > 0;
