-- AlterTable: تتبّع طريقة الدفع (CASH | CARD | CREDIT) لتفصيل مبالغ الوردية.
ALTER TABLE "Sale" ADD COLUMN "paymentMethod" TEXT;
