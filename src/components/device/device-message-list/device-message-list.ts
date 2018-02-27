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

import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable } from "aurelia-framework";

import { Time } from "Helpers/Time";
import { Device } from "Models/Device";
import { DeviceService } from "Services/DeviceService";

@autoinject
export class DeviceMessageList {
  @bindable
  appEui: string;

  @bindable
  device: Device;

  deviceMessages: MessageData[] = [];
  filteredMessages: MessageData[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private deviceService: DeviceService,
    private eventAggregator: EventAggregator,
  ) { }

  filteredDeviceMessagesCallback(filteredDeviceMessages: MessageData[]) {
    this.filteredMessages = filteredDeviceMessages;
  }

  bind() {
    this.deviceService.fetchDeviceDataByEUI(
      this.appEui,
      this.device.deviceEUI, {
        limit: 250,
        since: Time.DAWN_OF_TIME,
      }).then((deviceMessages) => {
        this.deviceMessages = deviceMessages;
      });
    this.subscriptions.push(this.eventAggregator.subscribe("deviceData", (deviceData: MessageData) => {
      if (this.device.deviceEUI === deviceData.deviceEUI) {
        this.deviceMessages.unshift(deviceData);
      }
    }));
  }

  unbind() {
    this.subscriptions.forEach((subscription) => subscription.dispose());
    this.subscriptions = [];
  }
}
