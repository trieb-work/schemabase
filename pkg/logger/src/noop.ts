/* eslint-disable @typescript-eslint/no-unused-vars */
import { ILogger, Fields, LogDrain } from "./logger";

export class NoopLogger implements ILogger {
  public withLogDrain(_logDrain: LogDrain): ILogger {
    return new NoopLogger();
  }

  public with(_additionalMeta: Fields): ILogger {
    return new NoopLogger();
  }

  public debug(_message: string, _fields: Fields): void {}

  public info(_message: string, _fields: Fields): void {}

  public warn(_message: string, _fields: Fields): void {}

  public error(_message: string, _fields: Fields): void {}

  public flush(): Promise<void> {
    return Promise.resolve();
  }
}
