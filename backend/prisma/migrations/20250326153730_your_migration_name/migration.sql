/*
  Warnings:

  - You are about to drop the column `BlockData` on the `Blockchain` table. All the data in the column will be lost.
  - You are about to drop the column `HospitalEmailID` on the `Blockchain` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[EmailID]` on the table `Blockchain` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `BirthDate` to the `Blockchain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DiseaseFirst` to the `Blockchain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DiseaseFive` to the `Blockchain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DiseaseFour` to the `Blockchain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DiseaseSecond` to the `Blockchain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DiseaseSix` to the `Blockchain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DiseaseThird` to the `Blockchain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EmailID` to the `Blockchain` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Blockchain_HospitalEmailID_key";

-- AlterTable
ALTER TABLE "Blockchain" DROP COLUMN "BlockData",
DROP COLUMN "HospitalEmailID",
ADD COLUMN     "BirthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "DiseaseFirst" TEXT NOT NULL,
ADD COLUMN     "DiseaseFive" TEXT NOT NULL,
ADD COLUMN     "DiseaseFour" TEXT NOT NULL,
ADD COLUMN     "DiseaseSecond" TEXT NOT NULL,
ADD COLUMN     "DiseaseSix" TEXT NOT NULL,
ADD COLUMN     "DiseaseThird" TEXT NOT NULL,
ADD COLUMN     "EmailID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Blockchain_EmailID_key" ON "Blockchain"("EmailID");
