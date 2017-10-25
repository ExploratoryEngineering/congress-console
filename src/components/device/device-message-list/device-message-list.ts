import { bindable, autoinject } from 'aurelia-framework';

import { Device } from 'Models/Device';
import { DeviceService } from 'Services/DeviceService';

@autoinject
export class DeviceMessageList {
  @bindable
  appEui: string;

  @bindable
  device: Device;

  @bindable
  deviceMessages: MessageData[] = [];

  filteredMessages: MessageData[];

  constructor(
    private deviceService: DeviceService
  ) { }

  filteredDeviceMessagesCallback(filteredDeviceMessages: MessageData[]) {
    this.filteredMessages = filteredDeviceMessages;
  }

  bind() {
    this.deviceService.fetchDeviceDataByEUI(
      this.appEui,
      this.device.deviceEUI, {
        limit: 50
      }).then((deviceMessages) => {
        this.deviceMessages = deviceMessages;
      });
  }
}
