import WebSocket from "ws";
import { FormatedData, RawData, RawDataKeys } from "../types/meteo_data_types";
import { DataController } from "./data_controller";
import { DataProvider } from "./data_provider";
import { formatData } from "../utils/data_helper";
import { EventEmitter } from "events";

class DataGrabber extends EventEmitter {
  private ws: WebSocket;
  private dataProvider: DataProvider;
  private dataController: DataController;
  private static readonly ROUNDING = 2;

  constructor(webSocketAddress: string, bufferSize: number | null = null) {
    super();
    // we set the communication channels
    console.log("webSocketAddress", webSocketAddress);
    this.ws = new WebSocket(webSocketAddress);
    this.dataProvider = new DataProvider();

    if (this.dataProvider) {
      console.log("data provider is set in constuctor !!");
    } else {
      console.log("data provider is NOT set !!!!");
    }

    // setting up the data controller -> to save the data in the database efficiently
    if (!bufferSize) {
      // if the buffer size is not set, we use the default one
      bufferSize = DataController.DEFAULT_BUFFER_SIZE;
    }
    console.log("buffer size in constructor of dataGrabber", bufferSize);
    this.dataController = new DataController(1, bufferSize);
  }

  // here we start the data grabber -> we set the callbacks for the websocket -> we start listening for the data
  public run(): boolean {
    if (!this.ws.OPEN || this.ws.CONNECTING) {
      console.log("data grabber is already running");
      return false;
    }

    this.setCallbacks();
    console.log("data grabber is running");
    return true;
  }

  // here we stop the data grabber -> we close the websocket
  public stop(): boolean {
    if (this.ws.CLOSED || this.ws.CLOSING) {
      console.log("data grabber is not running");
      return false;
    }

    this.ws.close();
    console.log("data grabber is stopped");
    return true;
  }

  // here we set the callbacks for the websocket, so we enable all the events from the meteo station
  private setCallbacks(): void {
    this.ws.on("error", () => this.wsError);
    // this.ws.on("open", this.wsOpen);
    this.ws.on("message", (data: string) => this.wsMessage(data));
    this.ws.on("close", (code: number, reason: Buffer) =>
      this.wsClose(code, reason)
    );
  }

  ///////////////////////
  // here we define all the callbacks for the websocket

  private wsError(): void {
    this.emit("error", this);
  }

  private wsClose(code: number, reason: Buffer): void {
    this.emit("close", this);
  }

  // private wsOpen(): void {
  //   this.ws.send("something, just to check if it works");
  // }

  private wsMessage(data: string): void {
    try {
      const rawData = JSON.parse(data) as RawData;
      // console.log("received: %s", rawData);

      const formatedData = formatData(rawData);
      // console.log("rawData recieved", formatedData);
      this.dataController.addData(formatedData);

      // now we send the data to the client every single time we receive it
      // if (this.dataProvider) {
      //   this.dataProvider.sendData([formatedData]);
      // } else {
      //   console.log("data provider is not set in wsMessage");
      // }
    } catch (error) {
      console.log(error);
    }
  }

  // private formatData(rawData: RawData): FormatedData {
  //   const { temperature, humidity, pressure, quality, rain, heat } = rawData;

  //   return {
  //     mac: rawData.mac,
  //     temperature: temperature ? parseFloat(temperature.toFixed(2)) : null,
  //     humidity: humidity ? humidity : null,
  //     pressure: pressure ? pressure : null,
  //     quality: quality ? quality : null,
  //     rain: rain ? rain : null,
  //     heat: heat ? heat : null,
  //     time: new Date(),
  //   };
  // }

  private checkProperties(rawData: RawData): void {
    const { temperature, humidity, pressure, quality } = rawData;
    if (!temperature) {
      rawData.temperature = null;
    }
  }
}

export { DataGrabber };
