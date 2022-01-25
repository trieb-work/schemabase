import winston from "winston";
import { env } from "@eci/pkg/env";

export type Fields = Record<string, unknown>;

export type LoggerConfig = {
  meta?: {
    /**
     * Unique id for every trace.
     */
    traceId?: string;
  } & Fields;
};

export interface ILogger {
  with(additionalMeta: Fields): ILogger;
  debug(message: string, fields?: Fields): void;
  info(message: string, fields?: Fields): void;
  warn(message: string, fields?: Fields): void;
  error(message: string, fields?: Fields): void;
}

export class Logger implements ILogger {
  private logger: winston.Logger;

  private meta: Record<string, unknown>;

  public constructor(config?: LoggerConfig) {
    this.meta = {
      env: env.require("ECI_ENV"),
      commit: env.get("GIT_COMMIT_SHA", env.get("VERCEL_GIT_COMMIT_SHA")),
      ...config?.meta,
    };
    this.logger = winston.createLogger({
      transports: [new winston.transports.Console()],
      format:
        env.get("VERCEL") === "1"
          ? winston.format.json()
          : winston.format.prettyPrint({
              colorize: true,
              depth: 10,
            }),
    });
  }

  /**
   * Create a child logger with more metadata to be logged.
   * Existing metadata is carried over unless overwritten
   */
  public with(additionalMeta: Fields): ILogger {
    const copy = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this,
    ) as Logger;

    copy.meta = { ...this.meta, ...additionalMeta };
    return copy;
  }

  /**
   * Serialize the message
   *
   * The fields will overwrite the default metadata if keys overlap.
   */
  private log(level: string, message: string, fields: Fields): void {
    this.logger.log(level, message, { ...this.meta, ...fields });
  }

  public debug(message: string, fields: Fields = {}): void {
    return this.log("debug", message, fields);
  }

  public info(message: string, fields: Fields = {}): void {
    return this.log("info", message, fields);
  }

  public warn(message: string, fields: Fields = {}): void {
    return this.log("warn", message, fields);
  }

  public error(message: string, fields: Fields = {}): void {
    return this.log("error", message, fields);
  }
}
