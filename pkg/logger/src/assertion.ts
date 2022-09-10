/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fields, ILogger, LogDrain } from "./logger";

type ConsoleLevel = "debug" | "log" | "info" | "warn" | "error";
type AnyFields = Fields & {
  [x: string]: any;
};
type LogEntry = {
  message: string;
  fields: AnyFields;
};

const LOG_PREFIX = "  TEST-LOGGER: ";

export class AssertionLogger implements ILogger {
  private messages: Record<ConsoleLevel, LogEntry[]> = {
    debug: [],
    log: [],
    info: [],
    warn: [],
    error: [],
  };

  public assertOneLogMessageMatches(
    level: ConsoleLevel,
    message: string | RegExp,
  ) {
    const match = this.messages[level].find((logEntry) =>
      typeof message === "string"
        ? logEntry.message.includes(message)
        : logEntry.message.match(message),
    );
    if (!match) {
      throw new Error(
        `No message found on loglevel ${level} that includes message: \n    "${message}"\n  in messages: ${JSON.stringify(
          this.messages[level],
          null,
          2,
        )}`,
      );
    }
  }

  public assertOneLogEntryMatches(
    level: ConsoleLevel,
    validator: (logEntry: LogEntry) => boolean,
  ) {
    // console.log("this.messages[level]", level, this.messages[level]);
    const match = this.messages[level].find(validator);
    if (!match) {
      throw new Error(
        `No valid logEntry found on loglevel ${level} for validator:\n    ${validator}\n  in messages: ${JSON.stringify(
          this.messages[level],
          null,
          2,
        )}`,
      );
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
    this.messages.debug.push({ message, fields });
    console.debug(
      "\x1b[1m" + LOG_PREFIX + message,
      "\x1b[2m",
      fields,
      "\x1b[0m",
    );
  }

  public info(message: string, fields: AnyFields = {}): void {
    this.messages.info.push({ message, fields });
    console.info(
      "\x1b[1m" + LOG_PREFIX + message,
      "\x1b[2m",
      fields,
      "\x1b[0m",
    );
  }

  public warn(message: string, fields: AnyFields = {}): void {
    this.messages.warn.push({ message, fields });
    console.warn(
      "\x1b[1m" + LOG_PREFIX + message,
      "\x1b[2m",
      fields,
      "\x1b[0m",
    );
  }

  public error(message: string, fields: AnyFields = {}): void {
    this.messages.error.push({ message, fields });
    console.error(
      "\x1b[1m" + LOG_PREFIX + message,
      "\x1b[2m",
      fields,
      "\x1b[0m",
    );
  }

  public flush(): Promise<void> {
    return Promise.resolve();
  }
}
