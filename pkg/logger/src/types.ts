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
    /**
     * Environment
     */
    env?: string;
  };
  enableElasticLogDrain?: boolean;
};

export interface ILogger {
  withLogDrain(logDrain: LogDrain): ILogger;
  with(additionalMeta: Fields): ILogger;
  debug(message: string, fields?: Fields): void;
  info(message: string, fields?: Fields): void;
  warn(message: string, fields?: Fields): void;
  error(message: string, fields?: Fields): void;
  // flush(): Promise<void>;
}
