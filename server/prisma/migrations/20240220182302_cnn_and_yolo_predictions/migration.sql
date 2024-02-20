/*
  Warnings:

  - Added the required column `cnnClassification` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yoloClassification` to the `Plant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plant" ADD COLUMN     "cnnClassification" TEXT NOT NULL,
ADD COLUMN     "yoloClassification" TEXT NOT NULL;
