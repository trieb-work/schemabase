/*
  Warnings:

  - Added the required column `projectId` to the `XentralProxyApp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `XentralProxyApp` ADD COLUMN `projectId` INTEGER NOT NULL;
