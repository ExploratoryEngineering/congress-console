/*
	Copyright 2018 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

import * as moment from "moment";

const INVALID_DATE = "Invalid date";

export class DateFormatValueConverter {
  toView(timestamp, format = "D/M/YYYY h:mm:ss a", inputFormat = [moment.ISO_8601, "x"]) {
    const date = moment(timestamp, inputFormat);
    if (date.isValid()) {
      return date.format(format);
    } else {
      return INVALID_DATE;
    }
  }
}
