import { LogManager } from 'aurelia-framework';

interface Logger {
  debug(...any);
  warn(...any);
  error(...any);
  info(...any);
}

export const LogBuilder = {
  /**
   * Creates an instance of a logger
   * @param subtitle A subtitle to be prepended to the log message
   * @param loggerName Name of the top level logger
   */
  create: (subtitle: string = '', loggerName: string = 'LoRa App'): Logger => {
    return LogManager.getLogger(`${loggerName}${subtitle ? ' - ' + subtitle : ''}`);
  }
};
