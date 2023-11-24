import { Data, Station } from "@prisma/client";

type FrontendStation = {
  name: string;
};

type FrontendData = {
  station: Station;
  data: Data[];
};

export { FrontendStation };
