import * as moment from 'moment';

export class DateFormatValueConverter {
  toView(timestamp, format = 'D/M/YYYY h:mm:ss a') {
    return moment(timestamp, 'X').format(format);
  }
}
