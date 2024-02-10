/*
  Warnings:

  - Added the required column `yoloURL` to the `Plant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plant" ADD COLUMN     "yoloURL" TEXT NOT NULL;
