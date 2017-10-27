import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { bindable, autoinject } from 'aurelia-framework';

import { Time } from 'Helpers/Time';
import { Device } from 'Models/Device';
import { DeviceService } from 'Services/DeviceService';

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
    private eventAggregator: EventAggregator
  ) { }

  filteredDeviceMessagesCallback(filteredDeviceMessages: MessageData[]) {
    this.filteredMessages = filteredDeviceMessages;
  }

  bind() {
    this.deviceService.fetchDeviceDataByEUI(
      this.appEui,
      this.device.deviceEUI, {
        limit: 250,
        since: Time.DAWN_OF_TIME
      }).then((deviceMessages) => {
        this.deviceMessages = deviceMessages;
      });
    this.subscriptions.push(this.eventAggregator.subscribe('deviceData', (deviceData: MessageData) => {
      if (this.device.deviceEUI === deviceData.deviceEUI) {
        this.deviceMessages.unshift(deviceData);
      }
    }));
  }

  unbind() {
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.subscriptions = [];
  }
}
