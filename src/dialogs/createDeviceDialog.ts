import { BadRequestError } from 'Helpers/ResponseHandler';
import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { DeviceService, NewOTAADevice, NewABPDevice } from 'Services/DeviceService';
import { Device } from 'Models/Device';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Device Dialog');

const DeviceTypes = {
  ABP: 'ABP',
  OTAA: 'OTAA'
};

@autoinject
export class CreateDeviceDialog {
  selectedType: string = DeviceTypes.OTAA;

  device: Device = new Device();
  appEui: string;

  constructor(
    private deviceService: DeviceService,
    private dialogController: DialogController
  ) { }

  submitDevice() {
    this.deviceService.createNewDevice(this.getNewDevice(), this.appEui).then((newDevice) => {
      this.dialogController.ok(newDevice);
    }).catch(error => {
      if (error instanceof BadRequestError) {
        Log.debug('400', error);
      } else {
        Log.error('Create device: Error occured', error);
        this.dialogController.cancel();
      }
    });
  }

  getNewDevice(): NewABPDevice | NewOTAADevice {
    if (this.selectedType === DeviceTypes.OTAA) {
      let otaaDevice: NewOTAADevice = {};
      return otaaDevice;
    } else {
      let abpDevice: NewABPDevice = {
        NwkSKey: this.device.nwkSKey,
        DevAddr: this.device.devAddr,
        AppSKey: this.device.appSKey,
        Type: this.selectedType,
      };
      return abpDevice;
    }
  }

  activate(args) {
    Log.debug('Activating with args:', args);
    this.appEui = args.appEUI;
  }
}
