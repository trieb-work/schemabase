import { CustomConsole, LogType, LogMessage } from "@jest/console";

const color = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    crimson: "\x1b[38m", // Scarlet
  },
  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
    crimson: "\x1b[48m",
  },
};

function simpleFormatter(type: LogType, message: LogMessage): string {
  const CONSOLE_INDENT = " ";
  const TYPE = type.toLocaleUpperCase().padStart(4).padEnd(5);
  let bg = color.bg.white;
  switch (type) {
    case "info":
      bg = color.bg.cyan;
      break;
    case "warn":
      bg = color.bg.yellow;
      break;
    case "debug":
      bg = color.bg.magenta;
      break;
    case "error":
      bg = color.bg.red;
      break;
  }
  return message
    .split(/\n/)
    .map(
      (line: string, i) =>
        `${bg}${color.fg.black}${CONSOLE_INDENT}${i === 0 ? TYPE : "  "}${
          color.reset
        } ${line}`,
    )
    .join("\n");
}
global.console = new CustomConsole(
  process.stdout,
  process.stderr,
  simpleFormatter,
);
