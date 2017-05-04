import { LogManager } from 'aurelia-framework';
import { Logger } from 'aurelia-logging/dist/aurelia-logging';

export const LogBuilder = {
  /**
   * Creates an instance of a logger
   * @param {string} [subtitle] A subtitle to be prepended to the log message
   * @param {string} [loggerName] Name of the top level logger
   */
  create: (subtitle: string = '', loggerName: string = 'LoRa App'): Logger => {
    return LogManager.getLogger(`${loggerName}${subtitle ? ' - ' + subtitle : ''}`);
  }
};
