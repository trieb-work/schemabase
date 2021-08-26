/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `ProductDataFeed` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductDataFeed.publicId_unique" ON "ProductDataFeed"("publicId");
