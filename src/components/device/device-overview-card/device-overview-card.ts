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
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable } from "aurelia-framework";
import { DOM } from "aurelia-pal";

import { Range } from "Helpers/Range";

import { DeviceService } from "Services/DeviceService";

import { Application } from "Models/Application";
import { Device } from "Models/Device";

interface AverageDeviceData {
  rssi: string;
}

interface TotalDeviceData {
  rssi: number;
  fCount: number;
}

@autoinject
export class DeviceOverviewCard {
  @bindable
  application: Application;
  @bindable
  device: Device;
  @bindable
  selectedRange: Range = Range.LAST_SIX_HOURS;

  messageData: MessageData[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private element: Element,
    private deviceService: DeviceService,
    private eventAggregator: EventAggregator,
  ) { }

  deleteDevice() {
    this.element.dispatchEvent(DOM.createCustomEvent(
      "delete-device",
      {
        bubbles: true,
      },
    ));
  }

  editDevice() {
    this.element.dispatchEvent(DOM.createCustomEvent(
      "edit-device",
      {
        bubbles: true,
      },
    ));
  }

  @computedFrom("messageData")
  get averageData(): AverageDeviceData {
    if (this.messageData.length === 0) {
      return {
        rssi: "No data",
      };
    }
    const dataTotals = this.messageData.reduce((total: TotalDeviceData, messageData: MessageData) => {
      return {
        rssi: total.rssi + messageData.rssi,
      };
    }, {
        rssi: 0,
      },
    );

    return {
      rssi: (dataTotals.rssi / this.messageData.length).toFixed(2),
    };
  }

  fetchDataForDevice() {
    this.deviceService.fetchDeviceDataByEUI(this.application.appEUI, this.device.deviceEUI, {
      since: this.selectedRange.value,
    }).then((data) => {
      this.messageData = data;
    });
  }

  selectedRangeChanged() {
    this.fetchDataForDevice();
  }

  bind() {
    this.fetchDataForDevice();
    this.subscriptions.push(this.eventAggregator.subscribe("deviceData", (deviceData: MessageData) => {
      if (this.device.deviceEUI === deviceData.deviceEUI) {
        this.messageData.push(deviceData);
        this.device.fCntUp += 1;
      }
    }));
  }

  unbind() {
    this.subscriptions.map((subscription) => subscription.dispose());
  }
}
