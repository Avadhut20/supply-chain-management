/*
  Warnings:

  - Added the required column `Address` to the `Insurance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Insurance" ADD COLUMN     "Address" TEXT NOT NULL;
