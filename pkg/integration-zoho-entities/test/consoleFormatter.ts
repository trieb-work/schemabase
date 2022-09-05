import { CustomConsole, LogType, LogMessage } from '@jest/console';
function simpleFormatter(type: LogType, message: LogMessage): string {
  const TITLE_INDENT = '    ';
  const CONSOLE_INDENT = TITLE_INDENT + '  ';
  const TYPE = type.toLocaleUpperCase().padEnd(5);
  return message
    .split(/\n/)
    .map((line: string, i) => `${CONSOLE_INDENT}${i === 0 ? TYPE : '  '} ${line}`)
    .join('\n');
}
global.console = new CustomConsole(process.stdout, process.stderr, simpleFormatter);