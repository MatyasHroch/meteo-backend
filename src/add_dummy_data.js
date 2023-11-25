const { PrismaClient } = require("@prisma/client");

const client = new PrismaClient();

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

function subtractMonths(date, months) {
  date.setMonth(date.getMonth() - months);

  return date;
}

function subtractDay(date, day) {
  date.setDate(date.getDate() - day);

  return date;
}

const mac = "A8:42:E3:49:4E:40";
// new Date();
// day 24
// week 168
// month 730
const count = 730;

let entries = [];

for (let index = 0; index < count; index++) {
  const newTime = subtractMonths(new Date(), 1);
  // const newTime = subtractDay(new Date(), 1);
  newTime.addHours(index);

  const meanTemperature = Math.floor(Math.random() * 35);
  const maxTemperature = meanTemperature + Math.floor(Math.random() * 10);
  const minTemperature = meanTemperature - Math.floor(Math.random() * 10);

  // const meanPressure = Math.floor(Math.random() * 10000) + 90000;
  // const maxPressure = meanPressure + Math.floor(Math.random() * 5) * 1000;
  // const minPressure = meanPressure - Math.floor(Math.random() * 5) * 1000;

  const meanHumidity = Math.floor(Math.random() * 30) + 10;
  const maxHumidity = meanHumidity + Math.floor(Math.random() * 5);
  const minHumidity = meanHumidity - Math.floor(Math.random() * 5);

  const entry = {
    mac: mac,
    time: newTime,
    meanTemperature,
    maxTemperature,
    minTemperature,
    meanHumidity,
    maxHumidity,
    minHumidity,
  };

  entries.push(client.meanData.create({ data: entry }));
}

Promise.all(entries);
