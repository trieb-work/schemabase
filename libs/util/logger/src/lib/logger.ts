import winston from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";
import { env } from "@chronark/env";
import APMAgent from "elastic-apm-node/start";
import ecsFormat from "@elastic/ecs-winston-format";

export type Fields = Record<string, unknown>;

export type LoggerConfig = {
  defaultMeta: {
    /**
     * Unique id for every trace.
     */
    traceId: string;

    /**
     * A unique identifier for each webhook.
     * Take the url path for example
     */
    webhookId?: string;

    /**
     * Unique id for every trace.
     */
    requestId: string;
  } & Fields;

  enableElastic?: boolean;
};

export class Logger {
  private static instance: Logger | null;
  private logger: winston.Logger;
  private meta: Record<string, unknown>;
  private elasticSearchTransport?: ElasticsearchTransport;
  private apm?: typeof APMAgent;

  public static new(config: LoggerConfig): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  private constructor(config: LoggerConfig) {
    this.meta = {
      ...config.defaultMeta,
      env: env.get("NODE_ENV"),
      commit: env.get("VERCEL_GIT_COMMIT_SHA"),
    };

    this.logger = winston.createLogger({
      transports: [new winston.transports.Console()],
      format:
        env.get("NODE_ENV") === "production"
          ? winston.format.json()
          : winston.format.prettyPrint(),
    });

    const isCI = env.get("CI") === "true";
    this.logger.info("CI", { isCI });
    if (!isCI && config.enableElastic) {
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
  public addMetadata(newMeta: Fields): void {
    this.meta = Object.assign(this.meta, newMeta);
  }

  /**
   * Serialize the message
   *
   * The fields will overwrite the default metadata if keys overlap.
   */
  private log(level: string, message: string, fields: Fields = {}): void {
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

  public async flush(): Promise<void> {
    await Promise.all([
      this.elasticSearchTransport?.flush(),
      this.apm?.flush(),
    ]);
  }
}
