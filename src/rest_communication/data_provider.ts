import { Request, Response } from "express";
import { DataController } from "./data_controller";
import { PrismaClient } from "@prisma/client";
import { formatMeanData } from "../utils/data_helper";
import { registerStation } from "../utils/register_station";

const prisma = new PrismaClient();

// TODO TEST
export async function addStation(req: Request, res: Response): Promise<void> {
  const body = req.body;
  console.log("body in addStation", body);
  if (body.name && body.uri) {
    await registerStation(body.uri, body.name, res);
    // res.status(200).send("OK");
  }
}

export async function deleteStation(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id: any = req.params.id;
    if (id) {
      const numbId = parseInt(id);
      console.log("id in delete", id);
      await prisma.station.delete({
        where: {
          id: numbId,
        },
      });
      console.log("station deleted");
    }
  } catch (error) {
    console.error(error);
  }
}

export async function changeStationName(
  req: Request,
  res: Response
): Promise<void> {
  const body = req.body;
  if (body.name && body.id) {
    console.log("body", body);
    const station = await prisma.station.update({
      where: { id: body.id },
      data: { name: body.name },
    });
    res.status(200).send(station);
  }
}

async function getDaily(req: Request, res: Response): Promise<void> {
  try {
    console.log("getDaily enpoint called");

    const dataType = req.params.dataType;
    // get last 24 hours
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    // get the data from the database
    const data = await prisma.meanData.findMany({
      where: {
        time: {
          gte: last24Hours,
        },
      },
    });
    // console.log("data in daily endpoint", data);
    // get them to the right format
    // { min, max, mean}

    const formatedData = formatMeanData(data, dataType);
    console.log("formatedData", formatedData);
    res.send(formatedData);
  } catch (error) {}
}

function getWeekly(req: Request, res: Response) {
  try {
    const dataType = req.params.dataType;
    const data = {};
    res.send(data);
  } catch (error) {}
}

function getMonthly(req: Request, res: Response) {
  try {
    const dataType = req.params.dataType;
    const data = {};
    res.send(data);
  } catch (error) {}
}

async function getStations(req: Request, res: Response) {
  const stations = await prisma.station.findMany();
  console.log(stations);

  res.send(stations);
}

export { getDaily, getWeekly, getMonthly, getStations };

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
