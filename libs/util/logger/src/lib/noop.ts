/* eslint-disable @typescript-eslint/no-unused-vars */
import { ILogger, Fields } from "./logger";

export class NoopLogger implements ILogger {
  public with(_additionalMeta: Fields): ILogger {
    return new NoopLogger();
  }
  public debug(_message: string, _fields: Fields): void {
    return;
  }
  public info(_message: string, _fields: Fields): void {
    return;
  }
  public warn(_message: string, _fields: Fields): void {
    return;
  }
  public error(_message: string, _fields: Fields): void {
    return;
  }
  public flush(): Promise<void> {
    return Promise.resolve();
  }
}
