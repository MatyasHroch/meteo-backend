import { PrismaClient, Station } from "@prisma/client";
import { RawStation } from "../types/meteo_raw_types";

const prisma = new PrismaClient();

class StationController {
  constructor() {}

  // creates a new station, assumes that the station does not exist and the station is in the correct format
  static async add(station: RawStation) {
    try {
      console.log("station in add in StationController", station);
      // const newStation = await prisma.station.create({
      //   data: station,
      // });
      // console.log("newStation", newStation);
      // return newStation;
    } catch (error) {
      console.error(error);
    }
  }

  static async get(id: number) {
    try {
      const station = await prisma.station.findUnique({
        where: {
          id,
        },
      });
      return station;
    } catch (error) {
      console.error(error);
    }
  }
}

export { StationController };
