import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { run } from "./src/data_grabber";

//For env File
dotenv.config();

// setting up the server
const app: Application = express();
const port = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// test of fetching data from the database
// run(1);

app.get("/api/v1/weather/:count", (req: Request, res: Response) => {
  res.send({ message: "Welcome to Express " });
});

app.get("/api/v1/station/:id", (req: Request, res: Response) => {
  res.send({ message: "Welcome to Express " });
});

app.get("/api/v1/stations/:count", (req: Request, res: Response) => {
  res.send({ message: "Welcome to Express " });
});

app.get("/api/v1");

// i need endpoins for all the stations:
// /api/v1/weather/station/:id

// i need endpoins for the weather data:
// /api/v1/weather/data/:id

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

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
