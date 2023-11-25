import { Data } from "@prisma/client";

type RawStation = {
  name: string;
};

type RawData = {
  mac: string;
  temperature?: GLfloat | null;
  humidity?: GLfloat | null;
  pressure?: GLfloat | null;
  quality?: GLfloat | null;
  rain?: GLfloat | null;
  heat?: GLfloat | null;
};

type FormatedData = {
  mac: string;
  temperature: GLfloat | null;
  humidity: GLfloat | null;
  pressure: GLfloat | null;
  quality: GLfloat | null;
  rain: GLfloat | null;
  heat: GLfloat | null;
  time: Date;
};
const RawDataKeys = [
  "mac",
  "temperature",
  "humidity",
  "pressure",
  "quality",
  "rain",
  "heat",
];

// temperature Float?
//   humidity    Float?
//   pressure    Float?
//   quality     Float?
//   rain        Float?
//   heat        Float?

export { RawStation, RawData, RawDataKeys, FormatedData };
