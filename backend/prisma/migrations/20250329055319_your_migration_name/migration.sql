/*
  Warnings:

  - You are about to drop the column `OrderId` on the `Medicine` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[PID]` on the table `Medicine` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Mobile_No]` on the table `Medicine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Date_of_Birth` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `First_Name` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Last_Name` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Mobile_No` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PID` to the `Medicine` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Medicine_OrderId_key";

-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "OrderId",
ADD COLUMN     "Date_of_Birth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "DiseaseFirst" TEXT NOT NULL DEFAULT 'NA',
ADD COLUMN     "DiseaseFive" TEXT NOT NULL DEFAULT 'NA',
ADD COLUMN     "DiseaseFour" TEXT NOT NULL DEFAULT 'NA',
ADD COLUMN     "DiseaseSecond" TEXT NOT NULL DEFAULT 'NA',
ADD COLUMN     "DiseaseSix" TEXT NOT NULL DEFAULT 'NA',
ADD COLUMN     "DiseaseThird" TEXT NOT NULL DEFAULT 'NA',
ADD COLUMN     "First_Name" TEXT NOT NULL,
ADD COLUMN     "Last_Name" TEXT NOT NULL,
ADD COLUMN     "Mobile_No" INTEGER NOT NULL,
ADD COLUMN     "PID" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_PID_key" ON "Medicine"("PID");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_Mobile_No_key" ON "Medicine"("Mobile_No");
