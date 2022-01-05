import winston from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";
import { env } from "@chronark/env";
import ecsFormat from "@elastic/ecs-winston-format";

export interface LogDrain {
  log: (message: string) => void;
}

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
  withLogDrain(logDrain: LogDrain): ILogger;
  with(additionalMeta: Fields): ILogger;
  debug(message: string, fields?: Fields): void;
  info(message: string, fields?: Fields): void;
  warn(message: string, fields?: Fields): void;
  error(message: string, fields?: Fields): void;
  flush(): Promise<void>;
}

export class Logger implements ILogger {
  private logger: winston.Logger;

  private meta: Record<string, unknown>;

  private elasticSearchTransport?: ElasticsearchTransport;

  private logDrains: LogDrain[] = [];

  public constructor(config?: LoggerConfig) {
    this.meta = {
      env: env.require("ECI_ENV"),
      commit: env.get("GIT_COMMIT_SHA", env.get("VERCEL_GIT_COMMIT_SHA")),
      ...config?.meta,
    };
    this.logger = winston.createLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.prettyPrint({
        colorize: true,
        depth: 10,
      }),
    });

    if (this.meta["env"] === "production") {
      this.debug("Enabling elastic transport");
      // this.apm ??= APMAgent.start({ serviceName: "eci-v2" });

      /**
       * ECS requires a special logging format.
       * This overwrites the prettyprint or json format.
       *
       * @see https://www.elastic.co/guide/en/ecs-logging/nodejs/current/winston.html
       */
      this.logger.format = ecsFormat({ convertReqRes: true });

      /**
       * Ships all our logs to elasticsearch
       */
      this.elasticSearchTransport = new ElasticsearchTransport({
        level: "info", // log info and above, not debug
        dataStream: true,
        clientOpts: {
          node: env.require("ELASTIC_LOGGING_SERVER"),
          auth: {
            username: env.require("ELASTIC_LOGGING_USERNAME"),
            password: env.require("ELASTIC_LOGGING_PASSWORD"),
          },
        },
      });
      this.logger.add(this.elasticSearchTransport);
    }
  }

  public withLogDrain(logDrain: LogDrain): ILogger {
    const copy = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this,
    ) as Logger;

    copy.logDrains.push(logDrain);
    return copy;
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
    for (const logDrain of this.logDrains) {
      logDrain.log(
        JSON.stringify({ level, message, ...this.meta, ...fields }, null, 2),
      );
    }
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

  public async flush(): Promise<void> {
    await Promise.all([this.elasticSearchTransport?.flush()]);
  }
}
