-- AlterTable
ALTER TABLE "Sale" ADD COLUMN "clientEventId" TEXT;
ALTER TABLE "Sale" ADD COLUMN "customerName" TEXT;
ALTER TABLE "Sale" ADD COLUMN "customerPhone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Sale_clientEventId_key" ON "Sale"("clientEventId");
