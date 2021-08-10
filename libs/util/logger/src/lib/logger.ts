import { Logger } from "tslog";
export type { Logger } from "tslog";
export const createLogger = (): Logger => {
  return new Logger();
};
