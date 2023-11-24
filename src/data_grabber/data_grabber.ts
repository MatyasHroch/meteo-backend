import WebSocket from "ws";
import { RawData } from "../types/meteo_raw_types";
import { DataController } from "../controllers/data_controller";
import { DataProvider } from "../controllers/data_provider";

class DataGrabber {
  private ws: WebSocket;
  private dataProvider: DataProvider;
  private dataController: DataController;
  private static readonly ROUNDING = 2;

  constructor(webSocketAddress: string, bufferSize: number | null = null) {
    // we set the communication channels
    this.ws = new WebSocket(webSocketAddress);
    this.dataProvider = new DataProvider();

    // setting up the data controller -> to save the data in the database efficiently
    if (!bufferSize) {
      // if the buffer size is not set, we use the default one
      bufferSize = DataController.DEFAULT_BUFFER_SIZE;
    }
    this.dataController = new DataController(bufferSize);
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
    this.ws.on("error", this.wsError);
    this.ws.on("open", this.wsOpen);
    this.ws.on("message", this.wsMessage);
  }

  ///////////////////////
  // here we define all the callbacks for the websocket

  private wsError(): void {
    console.error();
  }

  private wsOpen(): void {
    this.ws.send("something, just to check if it works");
  }

  private wsMessage(data: string): void {
    try {
      const rawData = JSON.parse(data) as RawData;
      const { temperature } = rawData;
      if (temperature) {
        rawData.temperature = Number(temperature.toFixed(DataGrabber.ROUNDING));
      }
      this.dataController.addData(rawData);

      // now we send the data to the client every single time we receive it
      this.dataProvider.sendData([rawData]);

      console.log("received: %s", data);
    } catch (error) {
      console.log(error);
    }
  }
}

export { DataGrabber };
