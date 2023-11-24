import { DataProvider } from "./src/controllers/data_provider";
import { DataGrabber } from "./src/data_grabber/data_grabber";

// const dataGrabber = new DataGrabber("ws://192.168.106.219:80/ws");
// dataGrabber.run();

function generateDummyData(count: number) {
  const dummy = [];

  for (let i = 1; i <= count; i++) {
    const temperature = Math.floor(Math.random() * (30 - 15 + 1)) + 15; // Random temperature between 15 and 30
    const humidity = Math.floor(Math.random() * (70 - 40 + 1)) + 40; // Random humidity between 40 and 70
    const pressure = Math.floor(Math.random() * (1020 - 990 + 1)) + 990; // Random pressure between 990 and 1020
    const quality = Math.floor(Math.random() * (100 - 60 + 1)) + 60; // Random quality between 60 and 100
    const time = new Date(); // Current time
    const id = i; // Incremental ID

    dummy.push({ temperature, humidity, pressure, quality, time, id });
  }

  return dummy;
}

// Example: Generate 50 sets of dummy data
const generatedDummyData = generateDummyData(50);
// console.log(generatedDummyData);
const dataProvider = new DataProvider();

setInterval(() => {
  console.log("sending data");
  const dataToSend = [];
  for (const data of generatedDummyData) {
    Math.random() > 0.5 ? dataToSend.push(data) : null;
  }
  dataProvider.sendData(dataToSend);
  //   dataProvider.sendData(generatedDummyData);
}, 2000);

// import express, { Express, Request, Response, Application } from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import bodyParser from "body-parser";
// import { Server } from "socket.io";
// import { PrismaClient } from "@prisma/client";

//For env File
// dotenv.config();

// Prisma just for tests
// const prisma = new PrismaClient();

// // setting up socket io
// const io = new Server(8001, {
//   cors: {
//     origin: "*",
//   },
// });

// // setting up the server
// const app: Application = express();
// const port = process.env.PORT || 8000;
// app.use(bodyParser.json());
// app.use(cors({ origin: true, credentials: true }));
// app.use(bodyParser.urlencoded({ extended: true }));

// io.on("connection", (socket) => {
//   socket.send("hello");
//   console.log("a user connected");
//   socket.on("chat message", (msg) => {
//     console.log("message: " + msg);
//   });
// });

// test of fetching data from the database
// run(1);

// app.get("/api/v1/weather/:count", (req: Request, res: Response) => {
//   res.send({ message: "Welcome to Express " });
// });

// app.get("/api/v1/station/:id", (req: Request, res: Response) => {
//   res.send({ message: "Welcome to Express " });
// });

// app.get("/api/v1/stations", (req: Request, res: Response) => {
//   res.send({ message: "Welcome to Express " });
// });

// app.get("/api/v1");

// i need endpoins for all the stations:
// /api/v1/weather/station/:id

// i need endpoins for the weather data:
// /api/v1/weather/data/:id

// app.listen(port, () => {
//   console.log(`Server is Fire at http://localhost:${port}`);
// });

// test of server
// app.get("/", (req: Request, res: Response) => {
//   res.send({ message: "Welcome to Express " });
// });

// test of server
// app.post("/", (req: Request, res: Response) => {
//   res.send("Welcome to Express & TypeScript Server POST");
// });

// test of params
// app.get("/api/:message", (req: Request, res: Response) => {
//   res.send({ message: "Welcome to " + req.params.message });
// });

// // test of body and adding entity
// app.post("/api/add", async (req: Request, res: Response) => {
//   try {

//     const newUser = await UserController.add(user);
//     console.log("newUser", newUser);
//     res.send({ message: "User added", user: user });
//   } catch (error) {
//     console.error(error);
//     res.send({ message: "Error" });
//   }
// });
