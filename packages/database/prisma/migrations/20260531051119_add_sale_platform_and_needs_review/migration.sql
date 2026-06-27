-- CreateEnum
CREATE TYPE "SalePlatform" AS ENUM ('POS_DESKTOP', 'POS_MOBILE', 'WEB');

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "platform" "SalePlatform" NOT NULL DEFAULT 'WEB';

-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "needsReview" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "StockMovement_needsReview_idx" ON "StockMovement"("needsReview");
