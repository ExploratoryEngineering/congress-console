import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable } from "aurelia-framework";

import "./device-message-stats.scss";

import { Device } from "Models/Device";
import { DeviceService } from "Services/DeviceService";

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

@autoinject
export class DeviceMessageStats {
  @bindable
  applicationEui: string;
  @bindable
  device: Device;

  lastMessage: MessageData;

  loading: boolean = true;
  subscriptions: Subscription[] = [];

  constructor(
    private deviceService: DeviceService,
    private eventAggregator: EventAggregator,
  ) { }

  getLastHeardFrom(): Promise<any> {
    return this.deviceService.fetchDeviceDataByEUI(
      this.applicationEui,
      this.device.deviceEUI,
      {
        limit: 1,
        since: Time.DAWN_OF_TIME,
      },
    ).then((messages) => {
      if (messages.length > 0) {
        this.lastMessage = messages[0];
      }
      this.loading = false;
    });
  }

  bind() {
    this.getLastHeardFrom();
    this.subscriptions.push(this.eventAggregator.subscribe("deviceData", (deviceData: MessageData) => {
      if (this.device.deviceEUI === deviceData.deviceEUI) {
        this.lastMessage = deviceData;
      }
    }));
  }

  unbind() {
    this.subscriptions.map((subscription) => subscription.dispose());
    this.subscriptions = [];
  }
}
