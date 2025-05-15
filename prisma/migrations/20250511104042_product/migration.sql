/*
  Warnings:

  - The values [NEW,USED] on the enum `Conditions` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PriceUnit" AS ENUM ('PER_ITEM', 'PER_KG', 'PER_LITER');

-- AlterEnum
BEGIN;
CREATE TYPE "Conditions_new" AS ENUM ('FRESH', 'OLD');
ALTER TABLE "products" ALTER COLUMN "condition" TYPE "Conditions_new" USING ("condition"::text::"Conditions_new");
ALTER TYPE "Conditions" RENAME TO "Conditions_old";
ALTER TYPE "Conditions_new" RENAME TO "Conditions";
DROP TYPE "Conditions_old";
COMMIT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "priceUnit" "PriceUnit" NOT NULL DEFAULT 'PER_KG',
ALTER COLUMN "condition" SET DEFAULT 'FRESH';
