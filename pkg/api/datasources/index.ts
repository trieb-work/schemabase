import { DB } from "./db";

export type DataSources = {
  db: DB;
};

export const dataSources = (): DataSources => {
  return {
    db: new DB(),
  };
};
