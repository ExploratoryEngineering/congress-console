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

export const Time = {
  DAWN_OF_TIME: "0",
  NOW: moment(),
  ONE_HOUR_AGO: moment().subtract(1, "hours"),
  START_OF_DAY: moment().startOf("day"),
  SIX_HOURS_AGO: moment().subtract(6, "hours"),
};
