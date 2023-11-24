import { Data } from "@prisma/client";

type RawStation = {
  name: string;
};

type RawData = {
  time: Date | null;
  temperature: GLfloat | null;
  humidity: GLfloat;
  pressure: GLfloat;
  quality: GLfloat;
  stationId?: number;
};

export { RawStation, RawData };
