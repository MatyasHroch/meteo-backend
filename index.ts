import express, { Express, Request, Response, Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { PrismaClient } from "@prisma/client";
import { DataGrabber } from "./src/socket_comunication/data_grabber";
import { DataFetcher } from "./src/rest_communication/data_fetcher";

import { getCommunication } from "./src/all_comunication";

import {
  getDaily,
  getWeekly,
  getMonthly,
  getStations,
  changeStation,
  addStation,
  deleteStation,
} from "./src/rest_communication/data_provider";

///////////////////////////////////////////////////////////
// SOCKET AND REST COMUNICATION TO THE IOT DEVICES
// AND SOCET COMUNICATION WITH THE FRONTEND

const allCommunication = getCommunication();
allCommunication.runAll();

/////////////////////////////////////////////////
// SET UP REST COMUNICATION WITH THE FRONTEND

// setting up the server
const app: Application = express();
const port = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// setting up the endpoints
app.get("/api/v1/daily/:stationId/:dataType", getDaily);

app.get("/api/v1/weekly/:stationId/:dataType", getWeekly);

app.get("/api/v1/monthly/:stationId/:dataType", getMonthly);

app.get("/api/v1/stations", getStations);
app.post("/api/v1/station", addStation);
app.put("/api/v1/station", changeStation);
app.delete("/api/v1/station/:id", deleteStation);

// app.get("/api/v1/station/weather/:id", (req: Request, res: Response) => {
//   res.send("weather");
// });

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

// // setting up socket io communication with all the IoT devices
// async function run() {
//   const stations = await prisma.station.findMany();
//   stations.forEach((station) => {
//     try {
//       const ip = station.uri;
//       const dg = new DataGrabber(`ws://${ip}/ws`, 5);
//       const df = new DataFetcher(`http://${ip}/`, station.mac, 2);
//       dg.run();
//       df.run();
//     } catch (error) {
//       console.error(error);
//     }
//   });
// }

// run();

// function generateDummyData(count: number) {
//   const dummy = [];

//   for (let i = 1; i <= count; i++) {
//     const temperature = Math.floor(Math.random() * (30 - 15 + 1)) + 15; // Random temperature between 15 and 30
//     const humidity = Math.floor(Math.random() * (70 - 40 + 1)) + 40; // Random humidity between 40 and 70
//     const pressure = Math.floor(Math.random() * (1020 - 990 + 1)) + 990; // Random pressure between 990 and 1020
//     const quality = Math.floor(Math.random() * (100 - 60 + 1)) + 60; // Random quality between 60 and 100
//     const time = new Date(); // Current time
//     const id = i; // Incremental ID
//     const stationId = 1; // Station ID

//     dummy.push({
//       temperature,
//       humidity,
//       pressure,
//       quality,
//       time,
//       id,
//       stationId,
//     });
//   }

//   return dummy;
// }

// // Example: Generate 50 sets of dummy data
// const generatedDummyData = generateDummyData(50);
// // console.log(generatedDummyData);
// const dataProvider = new DataProvider();
// const dataController = new DataController(1, 10);

// for (let i = 0; i < 11; i++) {
//   dataController.addData(generatedDummyData[i]);
// }

// setInterval(() => {
//   console.log("sending data");
//   const dataToSend = [];
//   for (const data of generatedDummyData) {
//     Math.random() > 0.5 ? dataToSend.push(data) : null;
//   }
//   dataProvider.sendData(dataToSend);
// }, 10000);

// try {
//   const dataGrabber1 = new DataGrabber("ws://10.74.7.63:80/ws", 5);
//   // const dataGrabber2 = new DataGrabber("ws://10.74.7.66:80/ws", 5);
//   dataGrabber1.run();
//   // dataGrabber2.run();
// } catch (error) {
//   console.error(error);
// }
