import { Request, Response } from "express";
import { DataController } from "./data_controller";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getDaily(req: Request, res: Response): Promise<void> {
  try {
    const data = {};
    res.send(data);
  } catch (error) {}
}

function getWeekly(req: Request, res: Response) {
  try {
    const data = {};
    res.send(data);
  } catch (error) {}
}

function getMonthly(req: Request, res: Response) {
  try {
    const data = {};
    res.send(data);
  } catch (error) {}
}

export { getDaily, getWeekly, getMonthly };

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
