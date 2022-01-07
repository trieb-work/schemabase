/*
  Warnings:

  - You are about to drop the column `orderId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalOrderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalOrderId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_orderId_fkey";

-- DropIndex
DROP INDEX "Order_orderId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderId",
ADD COLUMN     "externalOrderId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_externalOrderId_key" ON "Order"("externalOrderId");

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
