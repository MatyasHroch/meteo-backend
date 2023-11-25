-- DropForeignKey
ALTER TABLE "meanData" DROP CONSTRAINT "meanData_mac_fkey";

-- AddForeignKey
ALTER TABLE "meanData" ADD CONSTRAINT "meanData_mac_fkey" FOREIGN KEY ("mac") REFERENCES "Station"("mac") ON DELETE CASCADE ON UPDATE CASCADE;
