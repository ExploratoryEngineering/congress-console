import { autoinject } from 'aurelia-framework';
import { computedFrom } from 'aurelia-binding';
import { DialogController } from 'aurelia-dialog';

import { DeviceService, NewOTAADevice, NewABPDevice } from 'Services/DeviceService';
import { Device } from 'Models/Device';

import { BadRequestError } from 'Helpers/ResponseHandler';
import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Device Dialog');

const DeviceTypes = {
  ABP: 'ABP',
  OTAA: 'OTAA'
};

@autoinject
export class CreateDeviceDialog {
  selectedType: string = DeviceTypes.OTAA;

  appEui: string;
  device: Device = new Device();
  createdDevice: Device;
  step: number = 1;
  source: string = '';

  formError: string;

  constructor(
    private deviceService: DeviceService,
    private dialogController: DialogController
  ) {
    this.step = 1;
  }

  submitDevice() {
    Log.debug('New device is', this.device, this.getNewDevice());
    return this.deviceService.createNewDevice(this.getNewDevice(), this.appEui)
      .then(device => {
        this.createdDevice = device;
      })
      .catch(error => {
        if (error instanceof BadRequestError) {
          Log.debug('400', error);
          this.formError = error.content;
        } else {
          Log.error('Create device: Error occured', error);
          this.dialogController.cancel();
        }
      });
  }

  fetchSource() {
    return this.deviceService
      .fetchSourceForDevice(this.appEui, this.createdDevice.deviceEUI)
      .then(source => {
        this.source = source;
      });
  }

  getNewDevice(): NewABPDevice | NewOTAADevice {
    if (this.selectedType === DeviceTypes.OTAA) {
      let otaaDevice: NewOTAADevice = {
        DeviceType: 'OTAA',
        RelaxedCounter: this.device.relaxedCounter,
        Tags: this.device.tags
      };

      return otaaDevice;
    } else {
      let abpDevice: NewABPDevice = {
        DeviceType: 'ABP',
        NwkSKey: this.device.nwkSKey.padStart(32, '0'),
        DevAddr: this.device.devAddr,
        AppSKey: this.device.appSKey.padStart(32, '0'),
        RelaxedCounter: this.device.relaxedCounter,
        Tags: this.device.tags
      };

      return abpDevice;
    }
  }

  isStep(stepNumber: number) {
    return stepNumber === this.step;
  }

  @computedFrom('selectedType')
  get isAbp(): boolean {
    return this.selectedType === DeviceTypes.ABP;
  }

  @computedFrom('step')
  get nextText(): string {
    if (this.isStep(1)) {
      return 'Configure device';
    } else if (this.isStep(2)) {
      return 'Create device';
    } else {
      return 'To new device';
    }
  }

  goToStep(stepNumber: number) {
    Log.debug('Setting step to number', stepNumber);
    if (this.step !== 3) {
      this.step = stepNumber;
    }
  }

  next(): Promise<any> {
    if (this.isStep(1)) {
      this.step = 2;
      return Promise.resolve();
    } else if (this.isStep(2)) {
      return this.submitDevice()
        .then(() => this.fetchSource())
        .then(() => {
          this.dialogController.settings.overlayDismiss = false;
          this.step = 3;
        });
    } else if (this.isStep(3)) {
      return this.dialogController.ok(this.createdDevice);
    }
  }

  cancel() {
    this.dialogController.cancel();
  }

  activate(args) {
    Log.debug('Activating with args:', args);
    this.appEui = args.appEUI;
  }
}
