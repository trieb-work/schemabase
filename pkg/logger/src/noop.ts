/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fields, ILogger, LogDrain } from "./logger";

export class NoopLogger implements ILogger {
  public withLogDrain(_logDrain: LogDrain): ILogger {
    return new NoopLogger();
  }

  public with(_additionalMeta: Fields): ILogger {
    return new NoopLogger();
  }

  public debug(message: string, _fields: Fields): void {
    console.log(message);
  }

  public info(message: string, _fields: Fields): void {
    console.log(message);
  }

  public warn(message: string, _fields: Fields): void {
    console.log(message);
  }

  public error(message: string, _fields: Fields): void {
    console.log(message);
  }

  public flush(): Promise<void> {
    return Promise.resolve();
  }
}
