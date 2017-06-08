import { BadRequestError } from 'Helpers/ResponseHandler';
import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { DeviceService, NewOTAADevice, NewABPDevice } from 'Services/DeviceService';
import { Device } from 'Models/Device';

import { LogBuilder } from 'Helpers/LogBuilder';
import { computedFrom } from 'aurelia-binding';

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
  step: number = 1;
  source: string = '';

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
        this.device = device;
      })
      .catch(error => {
        if (error instanceof BadRequestError) {
          Log.debug('400', error);
        } else {
          Log.error('Create device: Error occured', error);
          this.dialogController.cancel();
        }
      });
  }

  fetchSource() {
    return this.deviceService
      .fetchSourceForDevice(this.appEui, this.device.deviceEUI)
      .then(source => {
        this.source = source;
      });
  }

  getNewDevice(): NewABPDevice | NewOTAADevice {
    if (this.selectedType === DeviceTypes.OTAA) {
      let otaaDevice: NewOTAADevice = {
        DeviceType: this.selectedType,
        RelaxedCounter: this.device.relaxedCounter,
        Tags: this.device.tags
      };

      return otaaDevice;
    } else {
      let abpDevice: NewABPDevice = {
        NwkSKey: this.device.nwkSKey,
        DevAddr: this.device.devAddr,
        AppSKey: this.device.appSKey,
        DeviceType: this.selectedType,
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
      return 'Finish';
    }
  }

  goToStep(stepNumber: number) {
    Log.debug('Setting step to number', stepNumber);
    if (this.step !== 3) {
      this.step = stepNumber;
    }
  }

  next() {
    if (this.isStep(1)) {
      this.step = 2;
    } else if (this.isStep(2)) {
      this.submitDevice()
        .then(() => this.fetchSource())
        .then(() => {
          this.step = 3;
        });
    } else if (this.isStep(3)) {
      this.dialogController.ok(this.device);
    }
  }

  activate(args) {
    Log.debug('Activating with args:', args);
    this.appEui = args.appEUI;
  }
}
