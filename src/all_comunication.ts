import { Server } from "ws";
import { DataGrabber } from "./socket_comunication/data_grabber";
import { DataFetcher } from "./rest_communication/data_fetcher";
import { getClientSocket } from "./socket_instances";
import { PrismaClient } from "@prisma/client";

class AllCommunication {
  private readonly firmwareSocketMap: Map<string, DataGrabber>;
  private readonly slowDataFetcherMap: Map<string, DataFetcher>;

  constructor() {
    this.firmwareSocketMap = new Map<string, DataGrabber>();
    this.slowDataFetcherMap = new Map<string, DataFetcher>();
  }

  addFirmwareCommunication(communication: DataGrabber, address: string) {
    this.firmwareSocketMap.set(address, communication);
  }

  removeFirmwareCommunication(address: string) {
    this.firmwareSocketMap.delete(address);
  }

  getAllFirmwareCommunication(): Map<string, DataGrabber> {
    return this.firmwareSocketMap;
  }

  addDataFetcherCommunication(communication: DataFetcher, address: string) {
    this.slowDataFetcherMap.set(address, communication);
  }

  removeDataFetcherCommunication(address: string) {
    this.slowDataFetcherMap.delete(address);
  }

  getAllDataFetcherCommunication(): Map<string, DataFetcher> {
    return this.slowDataFetcherMap;
  }

  public async runAll() {
    const prisma = new PrismaClient();
    // setting up socket io communication with all the IoT devices
    const stations = await prisma.station.findMany();
    stations.forEach((station) => {
      try {
        if (station.uri === null) {
          return;
        }
        const ip = station.uri;
        const dg = new DataGrabber(`ws://${ip}/ws`, 5);
        const df = new DataFetcher(`http://${ip}/`, station.mac, 2);
        if (dg.run()) {
          this.addFirmwareCommunication(dg, ip);
        }

        if (df.run()) {
          this.addDataFetcherCommunication(df, ip);
        }
      } catch (error) {
        console.error(error);
      }
    });

    this.firmwareSocketMap.forEach((communication) => {
      communication.run();
    });

    this.slowDataFetcherMap.forEach((communication) => {
      communication.run();
    });
  }
}

let communication: AllCommunication | null = null;
export function getCommunication(): AllCommunication {
  if (communication === null) {
    communication = new AllCommunication();
  }
  return communication;
}
