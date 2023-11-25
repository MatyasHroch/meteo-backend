import { getClientSocket } from "../socket_instances";
import { Server } from "socket.io";
import { FormatedData, FrontendData, RawData } from "../types/meteo_data_types";
import { PrismaClient } from "@prisma/client";

class DataProvider {
  private socket: Server;
  private database = new PrismaClient();
  constructor() {
    console.log("data provider constructor");
    this.socket = getClientSocket();
    if (!this.socket) {
      console.log("socket is not set");
    }
    this.setCallbacks();
  }

  public async sendData(
    data: FormatedData[] | FrontendData,
    event = "weather"
  ) {
    try {
      // console.log("data", data);
      // console.log("data sending to client", data);
      this.socket.emit(event, data);
    } catch (error) {
      console.error(error);
    }
  }

  private setCallbacks(): void {
    this.socket.on("message", (data) => this.socketMessage(data));
  }

  private socketMessage(data: string): void {
    console.log("data", data);
    this.socket.send("socket Message -> something, just to check if it works");
  }
}

export { DataProvider };
