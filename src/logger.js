/* eslint no-console: "off" */

import chalk from 'chalk';
import * as LogLevels from './log-levels';

function LOG() { /* no op */ }

export function logLevel() {
  const {
    LOG_LEVEL = LogLevels.INFO
  } = global;

  return LOG_LEVEL;
}

export const canLog = () => (logLevel() >= LogLevels.ALL);
export const canDir = () => (logLevel() >= LogLevels.ALL);
export const canError = () => (logLevel() >= LogLevels.ERROR);
export const canWarn = () => (logLevel() >= LogLevels.WARN);
export const canInfo = () => (logLevel() >= LogLevels.INFO);
export const canDebug = () => (logLevel() >= LogLevels.DEBUG);
export const canTrace = () => (logLevel() >= LogLevels.TRACE);
export const canClear = () => (logLevel() >= LogLevels.ALL);

function log(...args) {
  return (console.log || LOG).call(console, ...args);
}

const dir = (arg) => (console.dir || log.bind(console, chalk.gray('[log]')))(arg);
const error = (...args) => (console.error || log.bind(console, chalk.gray('[log]')))(...args);
const warn = (...args) => (console.warn || log.bind(console, chalk.gray('[log]')))(...args);
const info = (...args) => (console.info || log.bind(console, chalk.gray('[log]')))(...args);
const debug = (...args) => (console.debug || log.bind(console, chalk.gray('[log]')))(...args);
const trace = () => (console.trace || log.bind(console, chalk.gray('[log][trace]')))();
const clear = () => (console.clear || log.bind(console, chalk.gray('[log][clear]')))();

export default class Logger {
  static log(...args) {
    if (canLog()) log(chalk.gray('[log]'), ...args);
  }

  static dir(arg) {
    if (canDir()) dir(arg);
  }

  static error(...args) {
    if (canError()) error(chalk.red('[error]'), ...args);
  }

  static warn(...args) {
    if (canWarn()) warn(chalk.yellow('[warn]'), ...args);
  }

  static info(...args) {
    if (canInfo()) info(chalk.gray('[info]'), ...args);
  }

  static debug(...args) {
    if (canDebug()) debug(chalk.gray('[debug]'), ...args);
  }

  static trace() {
    if (canTrace()) trace();
  }

  static clear() {
    if (canClear()) clear();
  }
}
