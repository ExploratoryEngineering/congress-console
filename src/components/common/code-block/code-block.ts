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

import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, bindable, containerless } from "aurelia-framework";

import { CopyHelper } from "Helpers/CopyHelper";
import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("Code line");

@containerless
@autoinject
export class CodeBlock {
  @bindable
  icon: string;
  @bindable
  code: string;
  @bindable
  heading: string;
  copyHelper: CopyHelper = new CopyHelper();

  codeTextField: HTMLInputElement;

  constructor(
    private eventAggregator: EventAggregator,
  ) { }

  copySource() {
    Log.debug("Copying code line to clipboard");
    this.copyHelper.copyToClipBoard(this.code).then(() => {
      this.eventAggregator.publish("global:message", { body: "Copied code" });
    });
  }
}
