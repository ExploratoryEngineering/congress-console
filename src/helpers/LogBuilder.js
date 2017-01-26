import { LogManager } from 'aurelia-framework';

export const LogBuilder = {
  create: (subtitle = '', loggerName = 'LoRa App') => {
    return LogManager.getLogger(`${loggerName}${subtitle ? ' - ' + subtitle : '' }`);
  }
};
