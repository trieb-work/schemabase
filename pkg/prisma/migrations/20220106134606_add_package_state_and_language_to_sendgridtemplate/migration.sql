/*
  Warnings:

  - A unique constraint covering the columns `[trackingEmailAppId,language,packageState]` on the table `SendgridTemplate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `language` to the `SendgridTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageState` to the `SendgridTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('DE', 'EN');

-- DropIndex
DROP INDEX "SendgridTemplate_trackingEmailAppId_name_key";

-- AlterTable
ALTER TABLE "SendgridTemplate" ADD COLUMN     "language" "Language" NOT NULL,
ADD COLUMN     "packageState" "PackageState" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SendgridTemplate_trackingEmailAppId_language_packageState_key" ON "SendgridTemplate"("trackingEmailAppId", "language", "packageState");
