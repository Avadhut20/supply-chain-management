/*
  Warnings:

  - Added the required column `CompanyID` to the `PatientInsuranceInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PatientInsuranceInfo" ADD COLUMN     "CompanyID" INTEGER NOT NULL;
