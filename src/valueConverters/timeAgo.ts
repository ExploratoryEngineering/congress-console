import { LogBuilder } from "Helpers/LogBuilder";
import * as moment from "moment";

const INVALID_DATE = "Invalid date";

const Log = LogBuilder.create("Time ago");

export class TimeAgoValueConverter {
  toView(value, format = [moment.ISO_8601, "x"]) {
    const date = moment(value, format);

    if (date.isValid()) {
      return date.fromNow();
    } else {
      Log.warn("Invalid date", value);
      return INVALID_DATE;
    }
  }
}
