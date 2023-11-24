import WebSocket from "ws";
import { RawData } from "./types/meteo_raw_types";
import { DataController } from "./controllers/data_controller";
import { PrismaClient } from "@prisma/client";

const ROUNDING = 2;

async function run(stationId: number, bufferSize: number | null = null) {
  const ws = new WebSocket("ws://192.168.106.219:80/ws");
  // const station = await new PrismaClient().station.create({
  //   data: {
  //     name: "test",
  //   },
  // });
  // const stationId = station.id;

  if (!bufferSize) {
    bufferSize = DataController.DEFAULT_BUFFER_SIZE;
  }

  const dataController = new DataController(stationId, bufferSize);

  ws.on("error", console.error);

  ws.on("open", function open() {
    ws.send("something, just to check if it works");
  });

  ws.on("message", function message(data: string) {
    try {
      const rawData = JSON.parse(data) as RawData;
      const { temperature } = rawData;
      if (temperature) {
        rawData.temperature = Number(temperature.toFixed(ROUNDING));
      }
      dataController.addData(rawData);
      console.log("received: %s", data);
    } catch (error) {
      console.log(error);
    }
  });
}

// run(1);

export { run };
