import { meanData } from "@prisma/client";
import { FormatedData, RawData, Data } from "../types/meteo_data_types";
const ROUNDING = 2;

type objectBoolean = {
  [key: string]: boolean;
};

export function propertiesOk(data: RawData): objectBoolean {
  const result: objectBoolean = {};

  const { temperature, humidity, pressure, quality, rain, heat } = data;

  result.temperature =
    !(temperature && (temperature < -50 || temperature > 100)) ||
    temperature === null;

  result.humidity =
    !(humidity && (humidity < 0 || humidity > 100)) || humidity === null;

  result.pressure =
    !(pressure && (pressure < 0 || pressure > 200000)) || pressure === null;

  result.quality =
    !(quality && (quality < 0 || quality > 10000)) || quality === null;

  result.rain = !(rain && (rain < 0 || rain > 4095)) || rain === null;

  result.heat = !(heat && (heat < -50 || heat > 50)) || heat === null;

  return result;
}

export function getFormatedData(meanData: any, dataType: string) {
  var days = [];
  for (const entry of meanData) {
    entry.tag = entry.time.getDate();
    days.push(entry.time.getDate());
  }

  const uniqueDays = [...new Set(days)];

  const formatedData: any = {
    max: [],
    min: [],
    mean: [],
    time: [],
  };

  for (const day of uniqueDays) {
    const dayData = meanData.filter((entry: any) => entry.tag == day);
    // console.log("dayData", dayData);
    const formated = formatMeanData(dayData, dataType);
    // console.log("formated", formated);

    formated.max = formated.max.filter((entry: any) => entry != null);

    const maxSum = formated.max.reduce(
      (partialSum: any, a: any) => partialSum + a,
      0
    );

    formated.min = formated.min.filter((entry: any) => entry != null);
    const minSum = formated.min.reduce(
      (partialSum: any, a: any) => partialSum + a,
      0
    );

    formated.mean = formated.mean.filter((entry: any) => entry != null);
    const meanSum = formated.mean.reduce(
      (partialSum: any, a: any) => partialSum + a,
      0
    );
    console.log("meanSum", meanSum);
    console.log("formated.mean.length", formated.mean.length);
    console.log(dayData[0].time);

    formatedData.max.push(maxSum / formated.max.length);
    formatedData.min.push(minSum / formated.min.length);
    formatedData.mean.push(meanSum / formated.mean.length);
    formatedData.time.push(dayData[0].time);
  }

  return formatedData;
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
