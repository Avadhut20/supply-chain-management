/*
  Warnings:

  - The primary key for the `Hospital` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Patient_ID` on the `Hospital` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Hosptial_id]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Hosptial_id` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Hospital_Patient_ID_key";

-- AlterTable
ALTER TABLE "Hospital" DROP CONSTRAINT "Hospital_pkey",
DROP COLUMN "Patient_ID",
ADD COLUMN     "Hosptial_id" INTEGER NOT NULL,
ADD CONSTRAINT "Hospital_pkey" PRIMARY KEY ("Hosptial_id");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_Hosptial_id_key" ON "Hospital"("Hosptial_id");
