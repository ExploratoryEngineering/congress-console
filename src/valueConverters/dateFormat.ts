import * as moment from 'moment';

export class DateFormatValueConverter {
  toView(value, format = 'D/M/YYYY h:mm:ss a') {
    return moment(value, 'X').format(format);
  }
}
