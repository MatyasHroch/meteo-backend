-- CreateTable
CREATE TABLE "Station" (
    "id" SERIAL NOT NULL,
    "uri" TEXT NOT NULL,
    "mac" TEXT,
    "name" TEXT,
    "info" TEXT,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Data" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "temperature" DOUBLE PRECISION,
    "humidity" DOUBLE PRECISION,
    "pressure" DOUBLE PRECISION,
    "quality" DOUBLE PRECISION,
    "stationId" INTEGER NOT NULL,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Station_uri_key" ON "Station"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "Station_mac_key" ON "Station"("mac");

-- AddForeignKey
ALTER TABLE "Data" ADD CONSTRAINT "Data_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
