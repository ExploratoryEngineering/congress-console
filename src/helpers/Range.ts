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

import { Time } from "Helpers/Time";

export interface Range {
  id: string;
  value: string;
}

export const Range = {
  ONE_HOUR_AGO: {
    id: "Last hour",
    value: Time.ONE_HOUR_AGO.format("x"),
  },
  LAST_SIX_HOURS: {
    id: "Last six hours",
    value: Time.SIX_HOURS_AGO.format("x"),
  },
  START_OF_DAY: {
    id: "Start of day",
    value: Time.START_OF_DAY.format("x"),
  },
  DAWN_OF_TIME: {
    id: "Dawn of time",
    value: Time.DAWN_OF_TIME,
  },
};
