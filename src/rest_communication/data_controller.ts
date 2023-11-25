import { FormatedData, RawData } from "../types/meteo_data_types";
import { PrismaClient } from "@prisma/client";
import { Data } from "@prisma/client";
// import { DataProvider } from "./data_provider";

class DataController {
  static upStationsIds: number[] = [];
  private buffer: FormatedData[];
  private database: PrismaClient;
  private max: number;
  private maxTime: Date;
  private min: number;
  private minTime: Date;
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

    const temperature = this.processArray(temperatures);
    const humidity = this.processArray(humidities);
    const pressure = this.processArray(pressures);
    const quality = this.processArray(temperatures);
    const rain = this.processArray(rains);
    const heat = this.processArray(heats);

    this.buffer = [];
    return acumulated;
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
      this.processBufferData();
    } catch (error) {
      console.error(error);
    }
  }
}

export { DataController };