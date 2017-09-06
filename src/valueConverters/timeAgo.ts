import { LogBuilder } from 'Helpers/LogBuilder';
import * as moment from 'moment';

const INVALID_DATE = 'Invalid date';

const Log = LogBuilder.create('Time ago');

export class TimeAgoValueConverter {
  toView(value) {
    let date = moment(value, 'X');

    if (date.isValid()) {
      return date.fromNow();
    } else {
      Log.warn('Invalid date', value);
      return INVALID_DATE;
    }
  }
}
