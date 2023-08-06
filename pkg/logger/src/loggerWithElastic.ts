import { Logger } from "./logger";
import ecsFormat from "@elastic/ecs-winston-format";
import { ElasticsearchTransport } from "winston-elasticsearch";
import { env } from "@eci/pkg/env";
import { LoggerConfig } from "./types";

export class LoggerWithElastic extends Logger {
  public constructor(config?: LoggerConfig) {
    super();
    if (config?.enableElasticLogDrain) {
      this.info("Enabling elastic transport");
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

  public async flush(): Promise<void> {
    await Promise.all([this.elasticSearchTransport?.flush()]);
  }
}
