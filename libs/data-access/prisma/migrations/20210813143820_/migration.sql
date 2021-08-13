/*
  Warnings:

  - You are about to drop the column `authToken` on the `SaleorConfig` table. All the data in the column will be lost.
  - Added the required column `appToken` to the `SaleorConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SaleorConfig" DROP COLUMN "authToken",
ADD COLUMN     "appToken" TEXT NOT NULL;
