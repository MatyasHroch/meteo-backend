-- CreateTable
CREATE TABLE "meanData" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "mac" TEXT NOT NULL,
    "maxTemperature" DOUBLE PRECISION,
    "minTemperature" DOUBLE PRECISION,
    "meanTemperature" DOUBLE PRECISION,
    "maxHumidity" DOUBLE PRECISION,
    "minHumidity" DOUBLE PRECISION,
    "meanHumidity" DOUBLE PRECISION,
    "maxPressure" DOUBLE PRECISION,
    "minPressure" DOUBLE PRECISION,
    "meanPressure" DOUBLE PRECISION,
    "maxQuality" DOUBLE PRECISION,
    "minQuality" DOUBLE PRECISION,
    "meanQuality" DOUBLE PRECISION,
    "maxRain" DOUBLE PRECISION,
    "minRain" DOUBLE PRECISION,
    "meanRain" DOUBLE PRECISION,
    "maxHeat" DOUBLE PRECISION,
    "minHeat" DOUBLE PRECISION,
    "meanHeat" DOUBLE PRECISION,

    CONSTRAINT "meanData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "meanData" ADD CONSTRAINT "meanData_mac_fkey" FOREIGN KEY ("mac") REFERENCES "Station"("mac") ON DELETE RESTRICT ON UPDATE CASCADE;
