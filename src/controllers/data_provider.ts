import { getClientSocket } from "../socket_instances";
import { Server } from "socket.io";
import { FormatedData, RawData } from "../types/meteo_raw_types";
import { Data } from "ws";
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

  public async sendData(data: FormatedData[], event = "weather") {
    try {
      // console.log("data", data);
      console.log("data sending to client", data);
      this.socket.emit(event, data);
    } catch (error) {
      console.error(error);
    }
  }

  private setCallbacks(): void {
    this.socket.on("message", (data) => this.socketMessage(data));
    this.socket.on("getLastData", (count: number) => {
      this.sendLastData(count);
    });
  }

  public async sendLastData(count: number, event = "weather") {
    try {
      const data = await this.database.data.findMany({
        take: count,
        orderBy: {
          time: "desc",
        },
      });
      this.socket.emit(event, data);
    } catch (error) {
      console.error(error);
    }
  }

  private socketMessage(data: string): void {
    console.log("data", data);
    this.socket.send("socket Message -> something, just to check if it works");
  }
}

export { DataProvider };

// // import { PrismaClient } from "@prisma/client";
// // import { Server } from "socket.io";

// // const prisma = new PrismaClient();

// // // setting up socket io
// // const io = new Server(8001, {
// //   cors: {
// //     origin: "*",
// //   },
// // });

// // async function run() {
// //   io.on("connection", async (socket) => {
// //     socket.send("hello");
// //     console.log("a user connected");
// //     // io.emit("testEvent", { message: "This is a test message" });
// //     await sendWeatherData([]);
// //   });
// // }

// // async function sendWeatherData(weatherData: any) {
// //   io.emit("weather", weatherData);
// // }

// // run();
