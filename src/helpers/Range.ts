import { Time } from 'Helpers/Time';

export interface Range {
  id: string;
  value: string;
}

export const Range = {
  ONE_HOUR_AGO: {
    id: 'Last hour',
    value: Time.ONE_HOUR_AGO.format('X')
  },
  LAST_SIX_HOURS: {
    id: 'Last six hours',
    value: Time.SIX_HOURS_AGO.format('X')
  },
  START_OF_DAY: {
    id: 'Start of day',
    value: Time.START_OF_DAY.format('X')
  },
  DAWN_OF_TIME: {
    id: 'Dawn of time',
    value: Time.DAWN_OF_TIME
  }
};
