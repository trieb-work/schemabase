/*
  Warnings:

  - You are about to drop the column `status` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `PackageEvent` table. All the data in the column will be lost.
  - Added the required column `state` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `PackageEvent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PackageState" AS ENUM ('INIT', 'INFORMATION_RECEIVED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'FAILED_ATTEMPT', 'DELIVERED', 'AVAILABLE_FOR_PICKUP', 'EXCEPTION', 'EXPIRED', 'PENDING');

-- AlterTable
ALTER TABLE "Package" DROP COLUMN "status",
ADD COLUMN     "state" "PackageState" NOT NULL;

-- AlterTable
ALTER TABLE "PackageEvent" DROP COLUMN "status",
ADD COLUMN     "state" "PackageState" NOT NULL;

-- DropEnum
DROP TYPE "PackageStatus";
