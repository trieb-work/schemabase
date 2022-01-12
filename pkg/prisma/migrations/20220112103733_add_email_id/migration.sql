/*
  Warnings:

  - Added the required column `sentEmailId` to the `TransactionalEmail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransactionalEmail" ADD COLUMN     "sentEmailId" TEXT NOT NULL;
