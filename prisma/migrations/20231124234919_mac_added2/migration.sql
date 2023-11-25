/*
  Warnings:

  - You are about to drop the column `stationId` on the `Data` table. All the data in the column will be lost.
  - Added the required column `mac` to the `Data` table without a default value. This is not possible if the table is not empty.
  - Made the column `mac` on table `Station` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Data" DROP CONSTRAINT "Data_stationId_fkey";

-- AlterTable
ALTER TABLE "Data" DROP COLUMN "stationId",
ADD COLUMN     "mac" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Station" ALTER COLUMN "uri" DROP NOT NULL,
ALTER COLUMN "mac" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Data" ADD CONSTRAINT "Data_mac_fkey" FOREIGN KEY ("mac") REFERENCES "Station"("mac") ON DELETE RESTRICT ON UPDATE CASCADE;
