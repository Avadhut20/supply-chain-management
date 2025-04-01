/*
  Warnings:

  - You are about to drop the column `Address` on the `Insurance` table. All the data in the column will be lost.
  - You are about to drop the column `Base_Premium` on the `Insurance` table. All the data in the column will be lost.
  - You are about to drop the column `CompanyName` on the `Insurance` table. All the data in the column will be lost.
  - You are about to drop the column `Coverage_Info` on the `Insurance` table. All the data in the column will be lost.
  - You are about to drop the column `Email_IDs` on the `Insurance` table. All the data in the column will be lost.
  - You are about to drop the column `Mobile_Number` on the `Insurance` table. All the data in the column will be lost.
  - You are about to drop the column `PatientEmail` on the `Insurance` table. All the data in the column will be lost.
  - You are about to drop the column `PatientName` on the `Insurance` table. All the data in the column will be lost.
  - You are about to drop the column `Policy_Amount` on the `Insurance` table. All the data in the column will be lost.
  - You are about to drop the column `Policy_Name` on the `Insurance` table. All the data in the column will be lost.
  - You are about to drop the column `Policy_No` on the `Insurance` table. All the data in the column will be lost.
  - You are about to drop the column `Policy_Tenue` on the `Insurance` table. All the data in the column will be lost.
  - You are about to drop the column `Website` on the `Insurance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Email_id]` on the table `Insurance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Mobile_No]` on the table `Insurance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Email_id` to the `Insurance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Mobile_No` to the `Insurance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Name` to the `Insurance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Passwords` to the `Insurance` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Insurance_PatientEmail_key";

-- DropIndex
DROP INDEX "Insurance_Policy_No_key";

-- AlterTable
ALTER TABLE "Insurance" DROP COLUMN "Address",
DROP COLUMN "Base_Premium",
DROP COLUMN "CompanyName",
DROP COLUMN "Coverage_Info",
DROP COLUMN "Email_IDs",
DROP COLUMN "Mobile_Number",
DROP COLUMN "PatientEmail",
DROP COLUMN "PatientName",
DROP COLUMN "Policy_Amount",
DROP COLUMN "Policy_Name",
DROP COLUMN "Policy_No",
DROP COLUMN "Policy_Tenue",
DROP COLUMN "Website",
ADD COLUMN     "Email_id" TEXT NOT NULL,
ADD COLUMN     "Mobile_No" TEXT NOT NULL,
ADD COLUMN     "Name" TEXT NOT NULL,
ADD COLUMN     "Passwords" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PatientInsuranceInfo" (
    "T_ID" SERIAL NOT NULL,
    "PatientName" TEXT NOT NULL,
    "PatientEmail" TEXT NOT NULL,
    "CompanyName" TEXT NOT NULL,
    "Mobile_Number" TEXT NOT NULL,
    "Website" TEXT,
    "Address" TEXT NOT NULL,
    "Policy_No" TEXT NOT NULL,
    "Policy_Name" TEXT NOT NULL,
    "Policy_Tenue" INTEGER NOT NULL,
    "Base_Premium" DOUBLE PRECISION NOT NULL,
    "Coverage_Info" TEXT NOT NULL,
    "Policy_Amount" DOUBLE PRECISION NOT NULL,
    "Email_IDs" TEXT NOT NULL,

    CONSTRAINT "PatientInsuranceInfo_pkey" PRIMARY KEY ("T_ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "PatientInsuranceInfo_PatientEmail_key" ON "PatientInsuranceInfo"("PatientEmail");

-- CreateIndex
CREATE UNIQUE INDEX "PatientInsuranceInfo_Policy_No_key" ON "PatientInsuranceInfo"("Policy_No");

-- CreateIndex
CREATE UNIQUE INDEX "Insurance_Email_id_key" ON "Insurance"("Email_id");

-- CreateIndex
CREATE UNIQUE INDEX "Insurance_Mobile_No_key" ON "Insurance"("Mobile_No");
