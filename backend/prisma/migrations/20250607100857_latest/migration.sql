/*
  Warnings:

  - A unique constraint covering the columns `[Wallet_Address]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "Wallet_Address" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_Wallet_Address_key" ON "Hospital"("Wallet_Address");
