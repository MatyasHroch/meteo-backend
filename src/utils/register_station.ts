import WebSocket from "ws";
import { PrismaClient } from "@prisma/client";

async function registerStation(
  uri: string,
  name: string,
  res: any | null = null
) {
  const webSocketAddress = `ws://${uri}/ws`;
  const ws = new WebSocket(webSocketAddress);
  const prisma = new PrismaClient();
  if (ws.OPEN) {
    ws.on("message", async (data: string) => {
      console.log(data);
      const rawData = JSON.parse(data);
      const mac = rawData.mac;
      console.log("mac in register station", mac);
      console.log("name in register station", name);
      console.log("uri in register station", uri);

      const oldStation = await prisma.station.findUnique({
        where: {
          mac: mac,
        },
      });
      console.log("oldStation", oldStation);
      if (oldStation != null) {
        console.log("station already exists");
        ws.close();
        if (res != null) {
          res.status(200).send("OK");
        }
        return;
      }

      await prisma.station.create({
        data: {
          name,
          mac,
          uri,
        },
      });
      ws.close();
      if (res != null) {
        console.log("sending ok to the user");
        res.status(200).send("OK");
      }
    });
  }
}

export { registerStation };
