import * as moment from 'moment';

export const Time = {
  DAWN_OF_TIME: '0',
  NOW: moment(),
  ONE_HOUR_AGO: moment().subtract(1, 'hours'),
  START_OF_DAY: moment().startOf('day'),
  SIX_HOURS_AGO: moment().subtract(6, 'hours')
};
