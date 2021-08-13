/*
  Warnings:

  - Added the required column `authToken` to the `SaleorConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SaleorConfig" ADD COLUMN     "authToken" TEXT NOT NULL;
