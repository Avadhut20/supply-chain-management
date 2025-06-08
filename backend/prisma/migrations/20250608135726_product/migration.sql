/*
  Warnings:

  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Manufacturer_walletAddress_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT NOT NULL;
