/*
  Warnings:

  - You are about to drop the column `Status` on the `Dealer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[WalletAddress]` on the table `Dealer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `WalletAddress` to the `Dealer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Dealer_Mobile_key";

-- AlterTable
ALTER TABLE "Dealer" DROP COLUMN "Status",
ADD COLUMN     "WalletAddress" TEXT NOT NULL,
ALTER COLUMN "Password" DROP DEFAULT,
ALTER COLUMN "Password" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Dealer_WalletAddress_key" ON "Dealer"("WalletAddress");
