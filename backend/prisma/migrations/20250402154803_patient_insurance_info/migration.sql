/*
  Warnings:

  - You are about to drop the column `Email_IDs` on the `PatientInsuranceInfo` table. All the data in the column will be lost.
  - Added the required column `CompanyEmail_ID` to the `PatientInsuranceInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PatientID` to the `PatientInsuranceInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PatientInsuranceInfo" DROP COLUMN "Email_IDs",
ADD COLUMN     "CompanyEmail_ID" TEXT NOT NULL,
ADD COLUMN     "PatientID" INTEGER NOT NULL;
