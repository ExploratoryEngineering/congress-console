import { DialogController } from 'aurelia-dialog';

import { DeviceService, NewOTAADevice, NewABPDevice } from 'Services/DeviceService';
import { Device } from 'Models/Device';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Device Dialog');

const DeviceTypes = {
  ABP: 'abp',
  OTAA: 'otaa'
}

export class CreateDeviceDialog {
  static inject = [DeviceService, DialogController];

  deviceService: DeviceService;
  dialogController: DialogController;

  selectedType: string = DeviceTypes.OTAA;

  device: Device = new Device();

  constructor(deviceService, dialogController) {
    this.deviceService = deviceService;
    this.dialogController = dialogController;
  }

  submitDevice() {
    this.deviceService.createNewDevice(this.getNewDevice()).then((newDevice) => {
      this.dialogController.ok(newDevice);
    }).catch(error => {
      Log.error('Create device: Error occured', error);
    });
  }

  getNewDevice(): NewABPDevice | NewOTAADevice {
    if (this.selectedType === DeviceTypes.OTAA) {
      let otaaDevice: NewOTAADevice = {
        AppEui: this.device.appEui
      };

      return otaaDevice;
    } else {
      let abpDevice: NewABPDevice = {
        AppEui: this.device.appEui,
        NwkSKey: this.device.nwkSKey,
        DevAddr: this.device.devAddr,
        AppSKey: this.device.appSKey,
        Type: this.selectedType,
      }
      return abpDevice;
    }
  }

  activate(args) {
    this.device.appEui = args.appEUI;
    Log.debug(this.device);
  }
}
