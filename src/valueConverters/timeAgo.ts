import * as moment from 'moment';

const INVALID_DATE = 'Invalid date';

export class TimeAgoValueConverter {
  toView(value) {
    let date = moment(value, 'X');

    if (date.isValid()) {
      return date.fromNow();
    } else {
      return INVALID_DATE;
    }
  }
}
