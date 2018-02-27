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
import { autoinject, bindable } from "aurelia-framework";
import { CopyHelper } from "Helpers/CopyHelper";

@autoinject
export class DeviceMessageEntry {
  @bindable
  deviceMessage: MessageData;

  copyHelper = new CopyHelper();

  toggled: boolean = false;

  constructor(
    private eventAggregator: EventAggregator,
  ) { }

  toggle() {
    this.toggled = !this.toggled;
  }

  bind() {
    this.toggled = false;
  }

  copyAsJson(event: MouseEvent): Promise<any> {
    event.stopPropagation();
    event.preventDefault();

    return this.copyHelper.copyToClipBoard(JSON.stringify(this.deviceMessage)).then(() => {
      this.eventAggregator.publish("global:message", { body: "Copied code" });
    });
  }
}
