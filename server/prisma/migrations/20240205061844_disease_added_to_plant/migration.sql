/*
  Warnings:

  - Added the required column `confidence` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disease` to the `Plant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plant" ADD COLUMN     "confidence" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "disease" TEXT NOT NULL;
