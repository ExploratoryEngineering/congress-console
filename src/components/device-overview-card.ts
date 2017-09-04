import { computedFrom } from 'aurelia-binding';
import { bindable, autoinject } from 'aurelia-framework';

import { CustomEventHelper } from 'Helpers/CustomEventHelper';
import { Range } from 'Helpers/Range';

import { DeviceService } from 'Services/DeviceService';

import { Application } from 'Models/Application';
import { Device } from 'Models/Device';

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

  constructor(
    private element: Element,
    private deviceService: DeviceService
  ) { }

  deleteDevice() {
    CustomEventHelper.dispatchEvent(
      this.element,
      'delete-device',
      {
        bubbles: true
      }
    );
  }

  editDevice() {
    CustomEventHelper.dispatchEvent(
      this.element,
      'edit-device',
      {
        bubbles: true
      }
    );
  }

  @computedFrom('messageData')
  get averageData(): AverageDeviceData {
    if (this.messageData.length === 0) {
      return {
        rssi: 'No data'
      };
    }
    let dataTotals = this.messageData.reduce((total: TotalDeviceData, messageData: MessageData) => {
      return {
        rssi: total.rssi + messageData.rssi
      };
    }, {
        rssi: 0,
      }
    );

    return {
      rssi: (dataTotals.rssi / this.messageData.length).toFixed(2),
    };
  }

  fetchDataForDevice() {
    this.deviceService.fetchDeviceDataByEUI(this.application.appEUI, this.device.deviceEUI, {
      since: this.selectedRange.value
    }).then((data) => {
      this.messageData = this.messageData.concat(data);
    });
  }

  selectedRangeChanged() {
    this.fetchDataForDevice();
  }

  bind() {
    this.fetchDataForDevice();
  }
}
