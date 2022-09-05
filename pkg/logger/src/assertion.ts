/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fields, ILogger, LogDrain } from "./logger";

type ConsoleLevel = 'debug' | 'log' | 'info' | 'warn' | 'error';
type AnyFields = Fields & {
  [x: string]: any;
}
type LogEntry = {
  message: string,
  fields: AnyFields,
}

export class AssertionLogger implements ILogger {
  private messages: Record<ConsoleLevel, LogEntry[]> = {
    debug: [],
    log: [],
    info: [],
    warn: [],
    error: [],
  };

  public assertOneLogMessageMatches(level: ConsoleLevel, message: string | RegExp) {
    const match = this.messages[level].find((logEntry) => logEntry.message.match(message));
    if (!match) {
      throw new Error(`No message found on loglevel ${level} that includes "${message}"`);
    }
  }

  public assertOneLogEntryMatches(level: ConsoleLevel, validator: (logEntry: LogEntry) => boolean ) {
    const match = this.messages[level].find(validator);
    if (!match) {
      throw new Error(`No valid logEntry found on loglevel ${level} for validator ${validator} in messages ${this.messages[level]}`);
    }
  }

  public clearMessages(): void {
    for (const level of Object.keys(this.messages) as ConsoleLevel[]) {
      this.messages[level] = [];
    }
  }

  public withLogDrain(_logDrain: LogDrain): ILogger {
    return new AssertionLogger();
  }

  public with(_additionalMeta: AnyFields): ILogger {
    return new AssertionLogger();
  }

  public debug(message: string, fields: AnyFields = {}): void {
    this.messages.debug.push({message, fields});
    console.debug(message, fields);
  }

  public info(message: string, fields: AnyFields = {}): void {
    this.messages.info.push({message, fields});
    console.info(message, fields);
  }

  public warn(message: string, fields: AnyFields = {}): void {
    this.messages.warn.push({message, fields});
    console.warn(message, fields);
  }

  public error(message: string, fields: AnyFields = {}): void {
    this.messages.error.push({message, fields});
    console.error(message, fields);
  }

  public flush(): Promise<void> {
    return Promise.resolve();
  }
}
