import { DB } from "./db";

export interface DataSources {
  db: DB;
}

export const dataSources = (): DataSources => {
  return {
    db: new DB(),
  };
};
