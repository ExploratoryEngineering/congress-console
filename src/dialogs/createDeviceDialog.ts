import { DialogController } from 'aurelia-dialog';

import { DeviceService } from 'Services/DeviceService';
import { Device } from 'Models/Device';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Device Dialog');

export class CreateDeviceDialog {
  static inject = [DeviceService, DialogController];

  deviceService: DeviceService;
  dialogController: DialogController;

  device: Device = new Device();

  constructor(deviceService, dialogController) {
    this.deviceService = deviceService;
    this.dialogController = dialogController;
  }

  submitDevice() {
    this.deviceService.createNewDevice(this.device).then((newDevice) => {
      this.dialogController.ok(newDevice);
    }).catch(error => {
      Log.error('Create device: Error occured', error);
    });
  }

  activate(args) {
    this.device.appEui = args.appEUI;
    Log.debug(this.device);
  }
}
