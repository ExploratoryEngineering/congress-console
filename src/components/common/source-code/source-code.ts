import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, bindable } from "aurelia-framework";
import { CopyHelper } from "Helpers/CopyHelper";
import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("Source code");

@autoinject
export class SourceCode {
  @bindable
  headerText: string = "Your configuration file";
  @bindable
  source: string;
  copyHelper = new CopyHelper();

  constructor(
    private eventAggregator: EventAggregator,
  ) { }

  copySource() {
    this.copyHelper.copyToClipBoard(this.source).then(() => {
      this.eventAggregator.publish("global:message", { body: "Copied code" });
    });
  }
}
