import * as moment from 'moment';

const INVALID_DATE = 'Invalid date';

export class DateFormatValueConverter {
  toView(timestamp, format = 'D/M/YYYY h:mm:ss a') {
    let date = moment(timestamp, 'X');
    if (date.isValid()) {
      return date.format(format);
    } else {
      return INVALID_DATE;
    }
  }
}
