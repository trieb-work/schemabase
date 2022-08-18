/*
  Warnings:

  - A unique constraint covering the columns `[xentralId,xentralProxyAppId]` on the table `XentralProxyAuftrag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[xentralBelegNr,xentralProxyAppId]` on the table `XentralProxyAuftrag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `xentralBelegNr` to the `XentralProxyAuftrag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xentralId` to the `XentralProxyAuftrag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `XentralProxyAuftrag` ADD COLUMN `xentralBelegNr` INTEGER NOT NULL,
    ADD COLUMN `xentralId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `XentralProxyAuftrag_xentralId_xentralProxyAppId_key` ON `XentralProxyAuftrag`(`xentralId`, `xentralProxyAppId`);

-- CreateIndex
CREATE UNIQUE INDEX `XentralProxyAuftrag_xentralBelegNr_xentralProxyAppId_key` ON `XentralProxyAuftrag`(`xentralBelegNr`, `xentralProxyAppId`);
