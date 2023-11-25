import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { formatMeanData } from "../utils/data_helper";
import { registerStation } from "../utils/register_station";
import { getCommunication } from "../all_comunication";

const prisma = new PrismaClient();

// TODO TEST
export async function addStation(req: Request, res: Response): Promise<void> {
  const body = req.body;
  console.log("body in addStation", body);
  if (body.name && body.uri) {
    await registerStation(body.uri, body.name, res);
    // res.status(200).send("OK");
    const communication = getCommunication();
    communication.runAll();
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

async function changeStation(req: Request, res: Response): Promise<void> {
  const body = req.body;
  if (body.name && body.id) {
    console.log("body in update !!!", body);
    const station = await prisma.station.update({
      where: { id: body.id },
      data: { name: body.name, uri: body.uri },
    });
    console.log("station", station);

    const communication = getCommunication();
    communication.runAll();
    res.status(200).send(station);
  }
}

async function getDaily(req: Request, res: Response): Promise<void> {
  try {
    console.log("getDaily enpoint called");

    const stationId = req.params.stationId;
    const dataType = req.params.dataType;

    if (!dataType || !stationId) {
      res.status(400).send("Bad request");
      return;
    }
    // get the data from the database

    const station: any = await prisma.station.findUnique({
      where: {
        id: parseInt(stationId),
      },
    });
    // get last 24 hours
    let lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const data = await prisma.meanData.findMany({
      where: {
        AND: [
          {
            mac: station.mac,
          },
          {
            time: {
              gte: lastDay,
            },
          },
        ],
      },
    });
    // console.log("data", data);
    // console.log("data length", data.length);

    // console.log("data in daily endpoint", data);
    // get them to the right format
    // { min, max, mean}

    const formatedData = formatMeanData(data, dataType);
    res.send(formatedData);
  } catch (error) {}
}

async function getStations(req: Request, res: Response) {
  try {
    const stations = await prisma.station.findMany();
    res.send(
      stations.map((station) => {
        return { id: station.id, name: station.name };
      })
    );
  } catch (error) {
    console.error(error);
  }
}

async function getWeekly(req: Request, res: Response) {
  try {
    const dataType = req.params.dataType;
    const stationId = req.params.stationId;

    if (!dataType || !stationId) {
      res.status(400).send("Bad request");
      return;
    }
    // get last 24 hours
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const station: any = await prisma.station.findUnique({
      where: {
        id: parseInt(stationId),
      },
    });

    // get the data from the database7
    const data = await prisma.meanData.findMany({
      where: {
        mac: station.mac,
        time: {
          gte: lastWeek,
        },
      },
    });

    const formatedData = formatMeanData(data, dataType);
    // console.log("formatedData", formatedData);
    res.send(formatedData);
  } catch (error) {}
}

async function getMonthly(req: Request, res: Response) {
  try {
    console.log("getDaily enpoint called");

    const dataType = req.params.dataType;
    const stationId = req.params.stationId;

    if (!dataType || !stationId) {
      res.status(400).send("Bad request");
      return;
    }
    // get last 24 hours
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const station: any = await prisma.station.findUnique({
      where: {
        id: parseInt(stationId),
      },
    });
    // get the data from the database7
    const data = await prisma.meanData.findMany({
      where: {
        mac: station.mac,
        time: {
          gte: lastMonth,
        },
      },
    });

    console.log("data in daily endpoint", data);

    // get them to the right format
    // { min, max, mean}

    const formatedData = formatMeanData(data, dataType);
    // console.log("formatedData", formatedData);
    res.send(formatedData);
  } catch (error) {}
}

export { getDaily, getWeekly, getMonthly, getStations, changeStation };

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
