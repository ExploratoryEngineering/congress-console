import { DialogController } from 'aurelia-dialog';

import { DeviceService } from 'Services/DeviceService';
import { Device } from 'Models/Device';

export class CreateDeviceDialog {
  static inject = [DeviceService, DialogController];

  device = new Device();

  constructor(deviceService, dialogController) {
    this.deviceService = deviceService;
    this.dialog = dialogController;
  }

  submitDevice() {
    this.deviceService.createNewDevice(this.device).then(() => {
      this.dialog.ok();
    }).catch(error => {
      console.error('Create device: Error occured', error);
    });
  }

  activate(args) {
    this.device.appEUI = args.appEUI;
    console.log(this.device);
  }
}
