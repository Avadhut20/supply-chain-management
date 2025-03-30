/*
  Warnings:

  - Changed the type of `Medicine` on the `Medicine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "Medicine",
ADD COLUMN     "Medicine" JSONB NOT NULL;
