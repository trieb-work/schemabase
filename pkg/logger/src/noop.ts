/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Fields, ILogger, LogDrain } from "./types";

export class NoopLogger {
  public withLogDrain(_logDrain: LogDrain): ILogger {
    return new NoopLogger();
  }

  public with(_additionalMeta: Fields): ILogger {
    return new NoopLogger();
  }

  public debug(message: string, _fields: Fields): void {
    console.debug(message);
  }

  public info(message: string, _fields?: Fields): void {
    console.info(message);
  }

  public warn(message: string, _fields?: Fields): void {
    console.warn(message);
  }

  public error(message: string, _fields?: Fields): void {
    console.error(message);
  }

  public flush(): Promise<void> {
    return Promise.resolve();
  }
}
