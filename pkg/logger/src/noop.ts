/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fields, ILogger } from "./logger";

export class NoopLogger implements ILogger {
  public with(_additionalMeta: Fields): ILogger {
    return new NoopLogger();
  }

  public debug(_message: string, _fields?: Fields): void {}

  public info(_message: string, _fields?: Fields): void {}

  public warn(_message: string, _fields?: Fields): void {}

  public error(_message: string, _fields?: Fields): void {}

  public async flush(): Promise<void> {
    return await Promise.resolve();
  }
}
