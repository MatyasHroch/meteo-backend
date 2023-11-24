import { PrismaClient, Station } from "@prisma/client";
import { RawStation } from "../types/meteo_raw_types";

const prisma = new PrismaClient();

class StationController {
  constructor() {}

  // gets request directly from the frontend and checks if the req has the right format
  // the body must look like this: {station: {name: "stationName"}}
  static async routesAdd(req: Request, res: Response, result = {}) {
    try {
      const body = req.body || null;
      if (body && "station" in body) {
        const station = body.station as RawStation;
        this.add(station);
        console.log("user in routesAdd in StationController", station);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // creates a new station, assumes that the station does not exist and the station is in the correct format
  static async add(station: RawStation) {
    try {
      console.log("station in add in StationController", station);
      const newStation = await prisma.station.create({
        data: station,
      });
      console.log("newStation", newStation);
      return newStation;
    } catch (error) {
      console.error(error);
    }
  }
}

export { StationController };
