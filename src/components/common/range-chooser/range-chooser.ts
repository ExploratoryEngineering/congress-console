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
