-- DropForeignKey
ALTER TABLE "IncomingProductDataFeedWebhook" DROP CONSTRAINT "IncomingProductDataFeedWebhook_secretId_fkey";

-- AlterTable
ALTER TABLE "IncomingProductDataFeedWebhook" ALTER COLUMN "secretId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "IncomingProductDataFeedWebhook" ADD FOREIGN KEY ("secretId") REFERENCES "SecretKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;
