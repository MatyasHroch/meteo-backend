import { RawData } from "../types/meteo_raw_types";
import { PrismaClient } from "@prisma/client";
import { Data } from "@prisma/client";

class DataController {
  static upStationsIds: number[] = [];
  static DEFAULT_BUFFER_SIZE = 100;

  private buffer: Data[];
  private database: PrismaClient;
  private bufferSize: number;
  private stationId: number;
  //   private station: Station

  constructor(
    stationId: number,
    bufferSize = DataController.DEFAULT_BUFFER_SIZE
  ) {
    this.stationId = stationId;
    this.bufferSize = bufferSize;
    DataController.upStationsIds.push(stationId);

    this.database = new PrismaClient();
    this.buffer = [];
  }

  public async addData(data: RawData) {
    try {
      const rawData = data as RawData;
      if (rawData) {
        rawData.stationId = this.stationId;
        rawData.time = new Date();

        // now we check if the buffer is full and if we need to save the data persistently
        if (this.buffer.length >= this.bufferSize) {
          await this.saveBufferData();
          this.buffer = [];
        }

        // now we add the data to the buffer
        this.buffer.push(data as Data);
        console.log("data added to the buffer");
        console.log("buffer length", this.buffer.length);
        console.log("buffer size", this.bufferSize);
      } else {
        console.log("data is not in the right format");
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  // save the data in the database
  private async saveBufferData() {
    try {
      // later optimaze this, now the createMany function is not working
      for (const weatherData of this.buffer) {
        await this.database.data.create({
          data: weatherData,
        });
      }
      console.log("data saved to the database");
      //   this.database.data.
    } catch (error) {
      console.log("error", error);
    }
  }
}

export { DataController };
