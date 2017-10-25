import * as moment from 'moment';

const INVALID_DATE = 'Invalid date';

export class DateFormatValueConverter {
  toView(timestamp, format = 'D/M/YYYY h:mm:ss a', inputFormat = [moment.ISO_8601, 'x']) {
    let date = moment(timestamp, inputFormat);
    if (date.isValid()) {
      return date.format(format);
    } else {
      return INVALID_DATE;
    }
  }
}
