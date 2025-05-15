/*
  Warnings:

  - Added the required column `city` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- Add city column with default value
ALTER TABLE "orders" ADD COLUMN "city" TEXT NOT NULL DEFAULT 'Unknown';

-- Remove the default value after adding the column
ALTER TABLE "orders" ALTER COLUMN "city" DROP DEFAULT;
