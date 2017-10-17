import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { Device } from 'Models/Device';
import { DeviceService } from 'Services/DeviceService';

import { BadRequestError } from 'Helpers/ResponseHandler';
import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Edit Device Dialog');

@autoinject
export class EditDeviceDialog {
  applicationEui: string;
  device: Device;
  formError: string;

  constructor(
    private dialogController: DialogController,
    private deviceService: DeviceService
  ) { }

  submitDevice() {
    this.deviceService.updateDevice(this.applicationEui, this.device)
      .then((device) => {
        this.dialogController.ok(device);
      }).catch((error) => {
        if (error instanceof BadRequestError) {
          Log.debug('400', error);
          this.formError = error.content;
        } else {
          Log.error('Edit gateway: Error occured', error);
          this.dialogController.cancel();
        }
      });
  }

  activate(args) {
    this.device = args.device;
    this.applicationEui = args.applicationEui;
  }
}
