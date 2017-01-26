import { DialogController } from 'aurelia-dialog';

import { DeviceService } from 'Services/DeviceService';
import { Device } from 'Models/Device';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Device Dialog');

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
      Log.error('Create device: Error occured', error);
    });
  }

  activate(args) {
    this.device.appEUI = args.appEUI;
    Log.debug(this.device);
  }
}
