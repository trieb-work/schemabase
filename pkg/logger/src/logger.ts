import * as tslog from "tslog";

import { env } from "@eci/pkg/env";

export interface LogDrain {
  log: (message: string) => void;
}

export type Fields = Record<string, unknown>;

export interface LoggerConfig {
  meta?: {
    /**
     * Unique id for every trace.
     */
    traceId?: string;
  } & Fields;
}

export interface ILogger {
  with: (additionalMeta: Fields) => ILogger;
  debug: (message: string, fields?: Fields) => void;
  info: (message: string, fields?: Fields) => void;
  warn: (message: string, fields?: Fields) => void;
  error: (message: string, fields?: Fields) => void;
}

export class Logger implements ILogger {
  private readonly logger: tslog.Logger;

  private meta: Record<string, unknown>;

  public constructor(config?: LoggerConfig) {
    this.meta = {
      env: env.require("ECI_ENV"),
      commit: env.get("GIT_COMMIT_SHA", env.get("VERCEL_GIT_COMMIT_SHA")),
      ...config?.meta,
    };
    this.logger = new tslog.Logger({
      type: this.meta.env === "production" ? "json" : "pretty",
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

  public debug(message: string, fields: Fields = {}): void {
    this.logger.debug(message, {
      log: { level: "debug" },
      ...this.meta,
      ...fields,
    });
  }

  public info(message: string, fields: Fields = {}): void {
    this.logger.info(message, {
      log: { level: "info" },
      ...this.meta,
      ...fields,
    });
  }

  public warn(message: string, fields: Fields = {}): void {
    this.logger.warn(message, {
      log: { level: "warn" },
      ...this.meta,
      ...fields,
    });
  }

  public error(message: string, fields: Fields = {}): void {
    this.logger.error(message, {
      log: { level: "error" },
      ...this.meta,
      ...fields,
    });
  }
}
