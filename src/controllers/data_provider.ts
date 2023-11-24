import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";

const prisma = new PrismaClient();

// setting up socket io
const io = new Server(8001, {
  cors: {
    origin: "*",
  },
});

async function run() {
  io.on("connection", async (socket) => {
    socket.send("hello");
    console.log("a user connected");
    // io.emit("testEvent", { message: "This is a test message" });
    await sendWeatherData([]);
  });
}

async function sendWeatherData(weatherData: any) {
  io.emit("weather", weatherData);
}

run();
