/*
  Warnings:

  - You are about to drop the column `Coverage_Info` on the `InsuranceDetails` table. All the data in the column will be lost.
  - You are about to drop the column `Email_IDs` on the `InsuranceDetails` table. All the data in the column will be lost.
  - You are about to drop the column `Policy_Tenue` on the `InsuranceDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Email_id]` on the table `InsuranceDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Coverage` to the `InsuranceDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Email_id` to the `InsuranceDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Policy_Tenure` to the `InsuranceDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "InsuranceDetails_Email_IDs_key";

-- AlterTable
ALTER TABLE "InsuranceDetails" DROP COLUMN "Coverage_Info",
DROP COLUMN "Email_IDs",
DROP COLUMN "Policy_Tenue",
ADD COLUMN     "Coverage" TEXT NOT NULL,
ADD COLUMN     "Email_id" TEXT NOT NULL,
ADD COLUMN     "Policy_Tenure" INTEGER NOT NULL,
ALTER COLUMN "T_ID" DROP DEFAULT;
DROP SEQUENCE "InsuranceDetails_T_ID_seq";

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceDetails_Email_id_key" ON "InsuranceDetails"("Email_id");
