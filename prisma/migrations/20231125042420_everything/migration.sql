-- DropForeignKey
ALTER TABLE "Data" DROP CONSTRAINT "Data_mac_fkey";

-- AddForeignKey
ALTER TABLE "Data" ADD CONSTRAINT "Data_mac_fkey" FOREIGN KEY ("mac") REFERENCES "Station"("mac") ON DELETE CASCADE ON UPDATE CASCADE;
