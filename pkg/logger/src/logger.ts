import winston from "winston";
import { env } from "@eci/pkg/env";
import { Fields, ILogger, LogDrain, LoggerConfig } from "./types";
import { ElasticsearchTransport } from "winston-elasticsearch";

export class Logger implements ILogger {
    public logger: winston.Logger;

    private meta: Record<string, unknown>;

    public elasticSearchTransport?: ElasticsearchTransport;

    private logDrains: LogDrain[] = [];

    public constructor(config?: LoggerConfig) {
        this.meta = {
            service: {
                environment: config?.meta?.env ?? env.get("ECI_ENV"),
            },
            package: {
                version:
                    env.get("GIT_COMMIT_SHA") ??
                    env.get("VERCEL_GIT_COMMIT_SHA"),
            },
            trace: {
                id: config?.meta?.traceId,
            },
        };
        this.logger = winston.createLogger({
            transports: [new winston.transports.Console()],
            /**
             * In production, we don't want to log debug messages.
             * In development, we want to log debug messages.
             */
            level: env.get("NODE_ENV") === "production" ? "info" : "debug",
            format:
                /**
                 * If the environment variable "VERCEL" is 1, we do no longer pretty-print
                 */
                env.get("VERCEL") === "1" ||
                env.get("ECI_ENV") === "production" ||
                env.get("NODE_ENV") === "production"
                    ? winston.format.json()
                    : winston.format.prettyPrint({
                          colorize: true,
                          depth: 10,
                      }),
        });
        this.logDrains = config?.logDrains ?? [];
    }

    public withLogDrain(logDrain: LogDrain): ILogger {
        return new Logger({
            meta: this.meta,
            enableElasticLogDrain:
                typeof this.elasticSearchTransport !== "undefined",
            logDrains: [...this.logDrains, logDrain],
        });
    }

    /**
     * Create a child logger with more metadata to be logged.
     * Existing metadata is carried over unless overwritten
     */
    public with(additionalMeta: Fields): ILogger {
        return new Logger({
            meta: { ...this.meta, ...additionalMeta },
            enableElasticLogDrain:
                typeof this.elasticSearchTransport !== "undefined",
            logDrains: this.logDrains,
        });
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
                JSON.stringify(
                    { level, message, ...this.meta, ...fields },
                    null,
                    2,
                ),
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
}
