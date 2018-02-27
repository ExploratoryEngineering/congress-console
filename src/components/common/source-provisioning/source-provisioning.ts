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
