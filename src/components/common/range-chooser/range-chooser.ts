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

import { computedFrom } from "aurelia-binding";
import { EventAggregator } from "aurelia-event-aggregator";
import { bindable, bindingMode } from "aurelia-framework";
import { Range } from "Helpers/Range";

export class RangeChooser {
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  selectedRange: Range = Range.LAST_SIX_HOURS;
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  availableRanges: Range[] = [
    Range.ONE_HOUR_AGO,
    Range.LAST_SIX_HOURS,
    Range.START_OF_DAY,
  ];

  constructor(
    private eventAggregator: EventAggregator,
  ) { }

  @computedFrom("selectedRange")
  get selectableRanges(): Range[] {
    return this.availableRanges.filter((range: Range) => {
      return this.selectedRange.id !== range.id;
    });
  }

  selectRange(range: Range) {
    this.selectedRange = range;
  }
}
