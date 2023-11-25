# Build stage
FROM node:20-alpine AS build

RUN apk update

RUN mkdir /meteo-backend
COPY ./ /backend
WORKDIR /backend

RUN npm install
RUN npm run "build"
RUN npm run "start"

CMD [ "npm", "run", "start" ]
# CMD [ "node", "index.js" ]
