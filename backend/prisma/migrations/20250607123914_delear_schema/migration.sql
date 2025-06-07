/*
  Warnings:

  - Added the required column `walletAddress` to the `Insurance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletAddress` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Dealer_WalletAddress_key";

-- AlterTable
ALTER TABLE "Insurance" ADD COLUMN     "walletAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "walletAddress" TEXT NOT NULL;
