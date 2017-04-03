import { useView, autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { DeviceService } from 'Services/DeviceService';
import { Device } from 'Models/Device';

import { LogBuilder } from 'Helpers/LogBuilder';
import { BadRequestError } from 'Helpers/ResponseHandler';

const Log = LogBuilder.create('Device provision dialog');

@autoinject
export class ProvisionDeviceDialog {
  device: Device;
  appEUI: string;
  source: string;
  sourceTextField;

  constructor(
    private deviceService: DeviceService,
    private dialogController: DialogController
  ) { }

  activate(args) {
    this.device = args.device;
    this.appEUI = args.appEUI;

    this.deviceService.fetchSourceForDevice(
      this.appEUI,
      this.device.deviceEUI
    ).then(source => {
      this.source = source;
    });
  }
}
