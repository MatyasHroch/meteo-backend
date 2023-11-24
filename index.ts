import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Welcome to Express & TypeScript Server" });
});

app.get("/api/:message", (req: Request, res: Response) => {
  res.send({ message: "Welcome to " + req.params.message });
});

app.post("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server POST");
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
