import { FormatedData, RawData } from "../types/meteo_data_types";

export function formatData(rawData: RawData): FormatedData {
  const { temperature, humidity, pressure, quality, rain, heat } = rawData;

  return {
    mac: rawData.mac,
    temperature: temperature ? parseFloat(temperature.toFixed(2)) : null,
    humidity: humidity ? humidity : null,
    pressure: pressure ? pressure : null,
    quality: quality ? quality : null,
    rain: rain ? rain : null,
    heat: heat ? heat : null,
    time: new Date(),
  };
}
