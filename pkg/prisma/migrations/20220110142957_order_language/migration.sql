/*
  Warnings:

  - Added the required column `language` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "language" "Language" NOT NULL;
