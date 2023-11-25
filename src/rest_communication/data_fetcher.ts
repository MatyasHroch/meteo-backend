import WebSocket from "ws";
import { FormatedData, RawData, RawDataKeys } from "../types/meteo_data_types";
import { formatData, propertiesOk } from "../utils/data_helper";
import { DataController } from "./data_controller";
import { Axios } from "axios";
import { getDaily, getWeekly, getMonthly } from "./data_provider";

class DataFetcher {
  private readonly pollTimeMs: number;
  private readonly axios: Axios;
  private readonly webAddress: string;
  private readonly dataController: DataController;
  private intervalId?: NodeJS.Timeout | null = null;
  private readonly mac: string;
  private readonly millisecondsSaveInterval: number = 1000 * 5 * 60;

  constructor(webAddress: string, mac: string, pollTimeSeconds: number) {
    this.pollTimeMs = pollTimeSeconds * 1000;
    this.webAddress = webAddress;
    this.mac = mac;
    this.axios = new Axios({ method: "GET" });
    this.dataController = new DataController(mac);
  }

  // here we start the data grabber -> we set the callbacks for the websocket -> we start listening for the data
  public run(): boolean {
    if (this.intervalId !== null) {
      return false;
    }

    console.log("data fetcher is running");
    this.intervalId = setInterval(() => this.onTick(), this.pollTimeMs);
    setInterval(
      () => this.dataController.processBufferData(this.mac),
      this.millisecondsSaveInterval
    );

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
    const ok = propertiesOk(formatedData);

    // console.log("formatedData in onTick", formatedData);
    // console.log("ok in onTick", ok);

    for (const value of Object.keys(ok)) {
      if (ok[value as keyof typeof ok] === false)
        throw new Error("value is null");
    }

    // console.log("ok in onTick", ok);
    try {
      await this.dataController.addBufferData(formatedData);
    } catch (error) {
      console.error(error);
    }

    //
  }

  private async fetchData(): Promise<RawData> {
    let result: RawData;
    try {
      if (this.webAddress === null) throw new Error("webAddress is null");
      result = JSON.parse(
        (await this.axios.get(this.webAddress, { method: "GET" })).data
      ) as RawData;
      // console.log("result in fetchData from the HARDWARE", result);
    } catch (error) {
      throw error;
    }
    return result;
  }
}

export { DataFetcher };
