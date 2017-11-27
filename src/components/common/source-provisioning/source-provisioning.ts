import { computedFrom } from "aurelia-binding";
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, bindable } from "aurelia-framework";

import { CopyHelper } from "Helpers/CopyHelper";
import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("Source code");

@autoinject
export class SourceProvisioning {
  @bindable
  availableSourceTypes: Array<"c" | "lopy"> = ["c", "lopy"];
  @bindable
  lopySource: string = "";
  @bindable
  cSource: string = "";

  sourceType: "c" | "lopy" = "c";
  copyHelper = new CopyHelper();

  constructor(
    private eventAggregator: EventAggregator,
  ) { }

  setSourceType(sourceType: "c" | "lopy") {
    this.sourceType = sourceType;
  }

  copySource() {
    return this.copyHelper.copyToClipBoard(this.selectedSourceCode).then(() => {
      this.eventAggregator.publish("global:message", { body: "Copied source code" });
    });
  }

  @computedFrom("sourceType", "lopySource", "cSource")
  get selectedSourceCode(): string {
    if (this.sourceType === "c") {
      return this.cSource;
    } else if (this.sourceType === "lopy") {
      return this.lopySource;
    } else {
      return "Unknown code";
    }
  }

  bind() {
    this.sourceType = this.availableSourceTypes[0];
  }
}
