/*
  Warnings:

  - You are about to drop the column `email` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "email",
ADD COLUMN     "emails" TEXT[];
