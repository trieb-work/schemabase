import winston from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";
import { env } from "@chronark/env";
import APMAgent from "elastic-apm-node/start";

export type Field = {
  key: string;
  value: string | number | boolean | Record<string, unknown>;
};

export type LoggerConfig = {
  /**
   * Unique id for every request.
   */
  traceId: string;
  /**
   * A unique identifier for each webhook.
   * Take the url path for example
   */
  webhookId?: string;

  enableElastic?: boolean;
};
export class Logger {
  private logger: winston.Logger;
  private elasticSearchTransport?: ElasticsearchTransport;
  private apm?: typeof APMAgent;

  public constructor(config: LoggerConfig) {
    this.logger = winston.createLogger({
      transports: [new winston.transports.Console()],
      format:
        env.get("NODE_ENV") === "production"
          ? winston.format.json()
          : winston.format.prettyPrint(),
      defaultMeta: {
        traceId: config.traceId,
        webhookId: config.webhookId,
        env: env.get("NODE_ENV"),
        commit: env.get("VERCEL_GIT_COMMIT_SHA"),
      },
    });

    if (config.enableElastic) {
      this.debug("Enabling elastic transport");
      // this.apm ??= APMAgent.start({ serviceName: "eci-v2" });
      /**
       * Ships all our logs to elasticsearch
       */
      this.elasticSearchTransport = new ElasticsearchTransport({
        level: "info", // log info and above, not debug
        apm: this.apm,
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

  /**
   * Inject more metadata to be logged with every logging request.
   * Existing metadata is carried over unless overwritten
   */
  public addMetadata(key: string, value: string | number | boolean): void {
    const metaData = this.logger.defaultMeta;
    metaData[key] = value;
    this.logger = this.logger.child(metaData);
  }

  /**
   * Serialize the message
   */
  private log(level: string, message: string, fields?: Field[]): void {
    this.logger.log(level, message, fields);
  }

  public debug(message: string, ...fields: Field[]): void {
    return this.log("debug", message, fields);
  }

  public info(message: string, ...fields: Field[]): void {
    return this.log("info", message, fields);
  }

  public warn(message: string, ...fields: Field[]): void {
    return this.log("warn", message, fields);
  }

  public error(message: string, ...fields: Field[]): void {
    return this.log("error", message, fields);
  }

  public async flush(): Promise<void> {
    await Promise.all([
      this.elasticSearchTransport?.flush(),
      this.apm?.flush(),
    ]);
  }
}
