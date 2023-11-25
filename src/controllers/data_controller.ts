import { FormatedData, RawData } from "../types/meteo_raw_types";
import { PrismaClient } from "@prisma/client";
import { Data } from "@prisma/client";
import { DataProvider } from "./data_provider";

class DataController {
  static upStationsIds: number[] = [];
  static DEFAULT_BUFFER_SIZE = 100;

  private buffer: FormatedData[];
  private database: PrismaClient;
  private dataProvider: DataProvider;
  private bufferSize: number;
  private stationId: number;
  //   private station: Station

  constructor(
    stationId: number,
    bufferSize = DataController.DEFAULT_BUFFER_SIZE
  ) {
    this.stationId = stationId;
    console.log("bufferSize in constructor of dataController", bufferSize);
    this.bufferSize = bufferSize;

    DataController.upStationsIds.push(stationId);

    this.database = new PrismaClient();
    this.dataProvider = new DataProvider();
    this.buffer = [];
  }

  public async addData(data: FormatedData) {
    try {
      // throws an error if the data is not in the right format or the value is not in the right range
      this.propertiesOk(data);

      const rawData = data as FormatedData;
      if (rawData) {
        // now we check if the buffer is full and if we need to save the data persistently
        if (this.buffer.length >= this.bufferSize) {
          await this.saveBufferData();
          this.buffer = [];
        }

        // now we add the data to the buffer
        this.buffer.push(data as Data);
        // console.log("data added to the buffer");
        // console.log("buffer length", this.buffer.length);
        // console.log("buffer size", this.bufferSize);
      } else {
        console.log("data is not in the right format");
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  public async saveData(data: FormatedData[]) {
    try {
      for (const rawData of data) {
        await this.addData(rawData);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  // save the data in the database
  private async saveBufferData() {
    try {
      // for (const weatherData of this.buffer) {
      //   console.log("mac of the saved ", weatherData.mac);
      // }

      const station = await this.database.station.findUnique({
        where: {
          mac: this.buffer[0].mac,
        },
      });

      if (!station) {
        console.log("station is not found");
        await this.database.station.create({
          data: {
            mac: this.buffer[0].mac,
          },
        });
      }

      this.dataProvider.sendData(this.buffer);

      const newData = await this.database.data.createMany({
        data: this.buffer,
      });

      console.log("newData", newData);

      // if (this.dataProvider) {
      //   await this.dataProvider.sendData(this.buffer);
      // } else {
      //   console.log("data provider is not set in wsMessage");
      // }
      // for (const weatherData of this.buffer) {
      //   await this.database.data.create({
      //     data: weatherData,
      //   });
      // }
      console.log("data saved to the database");
      //   this.database.data.
    } catch (error) {
      console.log("error", error);
    }
  }

  private propertiesOk(data: RawData) {
    return true;
  }

  public async getLastData(count: number): Promise<Data[]> {
    return this.database.data.findMany({
      take: count,
      orderBy: {
        time: "desc",
      },
    });
  }
}

export { DataController };
