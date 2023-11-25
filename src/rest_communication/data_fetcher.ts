import WebSocket from "ws";
import { FormatedData, RawData, RawDataKeys } from "../types/meteo_data_types";
import { formatData } from "../utils/data_helper";
import { DataController } from "./data_controller";
import { Axios } from "axios";
import { getDaily, getWeekly, getMonthly } from "./data_provider";

class DataFetcher {
  private readonly pollTime: number;
  private readonly axios: Axios;
  private readonly webAddress: string;
  private readonly dataController: DataController;
  private intervalId?: NodeJS.Timeout | null = null;
  private readonly mac: string;

  constructor(webAddress: string, mac: string, pollTime: number) {
    this.pollTime = pollTime;
    this.webAddress = webAddress;
    this.mac = mac;
    this.axios = new Axios();
    this.dataController = new DataController(mac);
  }

  // here we start the data grabber -> we set the callbacks for the websocket -> we start listening for the data
  public run(): boolean {
    if (this.intervalId !== null) {
      return false;
    }
    this.intervalId = setInterval(this.onTick, this.pollTime);

    return true;
  }

  // here we stop the data grabber -> we close the websocket
  public stop(): boolean {
    if (this.intervalId === null) {
      return false;
    }

    clearInterval(this.intervalId);

    return true;
  }

  private async onTick(): Promise<void> {
    const rawData = await this.fetchData();
    const formatedData = formatData(rawData);
    this.dataController.addBufferData(formatedData);
    if (new Date().getMinutes() === 0) {
      this.dataController.processBufferData();
    }
  }

  private async fetchData(): Promise<RawData> {
    let result: RawData;
    try {
      result = JSON.parse(await this.axios.get(this.webAddress)) as RawData;
    } catch (error) {
      throw error;
    }
    return result;
  }
}

export { DataFetcher };
