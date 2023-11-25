import { meanData } from "@prisma/client";
import { FormatedData, RawData, Data } from "../types/meteo_data_types";
const ROUNDING = 2;

type objectBoolean = {
  [key: string]: boolean;
};

export function propertiesOk(data: RawData): objectBoolean {
  const result: objectBoolean = {};

  const { temperature, humidity, pressure, quality, rain, heat } = data;

  result.temperature = !(
    temperature &&
    (temperature < -50 || temperature > 100)
  );

  result.humidity = !(humidity && (humidity < 0 || humidity > 100));

  result.pressure = !(pressure && (pressure < 0 || pressure > 2000));

  result.quality = !(quality && (quality < 0 || quality > 100));

  result.rain = !(rain && (rain < 0 || rain > 4095));

  result.heat = !(heat && (heat < -50 || heat > 50));

  return result;
}

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
