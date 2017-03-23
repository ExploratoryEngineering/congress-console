import * as moment from 'moment';

export class TimeAgoValueConverter {
  toView(value) {
    return moment(value, 'X').fromNow();
  }
}
