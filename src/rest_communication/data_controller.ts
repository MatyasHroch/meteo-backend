import { FormatedData, RawData } from "../types/meteo_data_types";
import { PrismaClient } from "@prisma/client";
import { Data } from "@prisma/client";
// import { DataProvider } from "./data_provider";

class DataController {
  static upStationsIds: number[] = [];
  private buffer: FormatedData[];
  private database: PrismaClient;
  constructor(mac: string) {
    this.database = new PrismaClient();
    this.buffer = [];
  }

  public processBufferData() {
    const temperatures: Array<number> = [];
    const humidities: Array<number> = [];
    const pressures: Array<number> = [];
    const qualities: Array<number> = [];
    const rains: Array<number> = [];
    const heats: Array<number> = [];

    this.buffer.forEach((el) => {
      // TODO: Dictionary
      if (el.temperature != null) {
        temperatures.push(el.temperature);
      }
      if (el.humidity != null) {
        humidities.push(el.humidity);
      }
      if (el.pressure != null) {
        pressures.push(el.pressure);
      }
      if (el.quality != null) {
        qualities.push(el.quality);
      }
      if (el.rain != null) {
        rains.push(el.rain);
      }
      if (el.heat != null) {
        heats.push(el.heat);
      }
    });

    this.buffer = [];

    const temperature = this.processArray(temperatures);
    const humidity = this.processArray(humidities);
    const pressure = this.processArray(pressures);
    const quality = this.processArray(qualities);
    const rain = this.processArray(rains);
    const heat = this.processArray(heats);

    const allData: any = {
      temperature,
      humidity,
      pressure,
      quality,
      rain,
      heat,
    };
    const meanData: any = {};

    for (const dataType in allData) {
      for (const value in allData) {
        const type = dataType[0].toUpperCase() + dataType.slice(1);
        const key = `${value}${type}`;
        meanData[key] = allData[dataType][value];
      }
    }

    console.log("meanData", meanData);
    // add to the database
    this.database.meanData.create({
      data: meanData,
    });

    return meanData;
  }

  private add(accumulator: number, a: number) {
    return accumulator + a;
  }

  private processArray(values: Array<number>) {
    const sum = values.reduce(this.add, 0);
    const mean = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    return { mean, max, min };
  }

  public async addBufferData(data: FormatedData) {
    try {
      this.buffer.push(data);
      console.log("Pushed to the buffer");
      if (this.buffer.length >= 20) {
        await this.processBufferData();
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export { DataController };
