/*
  Warnings:

  - You are about to drop the column `priceUnit` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "priceUnit",
ADD COLUMN     "weight" DOUBLE PRECISION;

-- DropEnum
DROP TYPE "PriceUnit";
