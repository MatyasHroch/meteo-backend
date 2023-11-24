import { getClientSocket } from "../socket_instances";
import { Server } from "socket.io";
import { RawData } from "../types/meteo_raw_types";
import { Data } from "ws";

class DataProvider {
  private socket: Server;
  constructor() {
    this.socket = getClientSocket();
    this.setCallbacks();
  }

  public async sendData(data: RawData[] | Data[], event = "weather") {
    try {
      // console.log("data", data);
      this.socket.emit(event, data);
    } catch (error) {
      console.error(error);
    }
  }

  private setCallbacks(): void {
    this.socket.on("message", this.socketMessage);
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
