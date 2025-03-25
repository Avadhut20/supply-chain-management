/*
  Warnings:

  - You are about to drop the column `Gender` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `Middle_Name` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Hosptial_Name]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Hosptial_Name` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Gender` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalName` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "Gender",
ADD COLUMN     "Hosptial_Name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "Middle_Name",
ADD COLUMN     "Gender" TEXT NOT NULL,
ADD COLUMN     "hospitalName" TEXT NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_Hosptial_Name_key" ON "Hospital"("Hosptial_Name");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_hospitalName_fkey" FOREIGN KEY ("hospitalName") REFERENCES "Hospital"("Hosptial_Name") ON DELETE RESTRICT ON UPDATE CASCADE;
