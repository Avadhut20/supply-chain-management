/*
  Warnings:

  - You are about to drop the column `Company` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the column `Cost` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the column `MedName` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the column `Quantity` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the column `SubMedName` on the `Medicine` table. All the data in the column will be lost.
  - The `OrderId` column on the `Medicine` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `TrackingId` column on the `Medicine` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "Company",
DROP COLUMN "Cost",
DROP COLUMN "MedName",
DROP COLUMN "Quantity",
DROP COLUMN "SubMedName",
ADD COLUMN     "Medicine" JSONB[],
DROP COLUMN "OrderId",
ADD COLUMN     "OrderId" SERIAL NOT NULL,
DROP COLUMN "TrackingId",
ADD COLUMN     "TrackingId" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_OrderId_key" ON "Medicine"("OrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_TrackingId_key" ON "Medicine"("TrackingId");
