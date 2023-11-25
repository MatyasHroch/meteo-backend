import { meanData } from "@prisma/client";
import { FormatedData, RawData, Data } from "../types/meteo_data_types";
const ROUNDING = 2;

// export function propertiesOk(data: RawData): boolean {
//   const { temperature, humidity, pressure, quality, rain, heat } = data;
//   if (temperature && (temperature < -50 || temperature > 100)) {
//     throw new Error("temperature is not in the right range");
//   }
//   if (humidity && (humidity < 0 || humidity > 100)) {
//     throw new Error("humidity is not in the right range");
//   }
//   if (pressure && (pressure < 0 || pressure > 2000)) {
//     throw new Error("pressure is not in the right range");
//   }
//   if (quality && (quality < 0 || quality > 100)) {
//     throw new Error("quality is not in the right range");
//   }
//   if (rain && (rain < 0 || rain > 4095)) {
//     throw new Error("rain is not in the right range");
//   }
//   if (heat && (heat < -50 || heat > 50)) {
//     throw new Error("heat is not in the right range");
//   }
// }

export function formatMeanData(meanData: meanData[], dataType: string) {
  const data: any = {
    max: [],
    min: [],
    mean: [],
    time: [],
  };

  if (dataType === "temperature") {
    for (const entry of meanData) {
      data.max.push(entry.maxTemperature);
      data.min.push(entry.minTemperature);
      data.mean.push(entry.meanTemperature);
      data.time.push(entry.time);
    }
  }

  if (dataType === "humidity") {
    for (const entry of meanData) {
      data.max.push(entry.maxHumidity);
      data.min.push(entry.minHumidity);
      data.mean.push(entry.meanHumidity);
      data.time.push(entry.time);
    }
  }

  if (dataType === "pressure") {
    for (const entry of meanData) {
      data.max.push(entry.maxPressure);
      data.min.push(entry.minPressure);
      data.mean.push(entry.meanPressure);
      data.time.push(entry.time);
    }
  }

  return data;
}

export function formatData(rawData: RawData): FormatedData {
  const { temperature, humidity, pressure, quality, rain, heat } = rawData;

  return {
    mac: rawData.mac,
    temperature: temperature ? parseFloat(temperature.toFixed(ROUNDING)) : null,
    humidity: humidity ? humidity : null,
    pressure: pressure ? pressure : null,
    quality: quality ? quality : null,
    rain: rain ? rain : null,
    heat: heat ? heat : null,
    time: new Date(),
  };
}
