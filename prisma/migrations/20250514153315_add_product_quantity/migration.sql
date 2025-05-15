-- DropIndex
DROP INDEX "orders_transactionId_key";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;
