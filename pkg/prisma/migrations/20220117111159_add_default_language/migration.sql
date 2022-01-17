/*
  Warnings:

  - Added the required column `defaultLanguage` to the `TrackingEmailApp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrackingEmailApp" ADD COLUMN     "defaultLanguage" "Language" NOT NULL;
