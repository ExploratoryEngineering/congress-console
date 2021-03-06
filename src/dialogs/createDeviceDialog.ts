/*
	Copyright 2018 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

import { computedFrom } from "aurelia-binding";
import { DialogController } from "aurelia-dialog";
import { autoinject } from "aurelia-framework";

import { Device } from "Models/Device";
import { DeviceService, NewABPDevice, NewOTAADevice } from "Services/DeviceService";

import { LogBuilder } from "Helpers/LogBuilder";
import { BadRequestError } from "Helpers/ResponseHandler";

const Log = LogBuilder.create("Device Dialog");

const DeviceTypes = {
  ABP: "ABP",
  OTAA: "OTAA",
};

@autoinject
export class CreateDeviceDialog {
  selectedType: string = DeviceTypes.OTAA;

  appEui: string;
  device: Device = new Device();
  createdDevice: Device;
  step: number = 1;

  cSource: string = "";
  lopySource: string = "";

  formError: string;

  constructor(
    private deviceService: DeviceService,
    private dialogController: DialogController,
  ) {
    this.step = 1;
  }

  submitDevice() {
    Log.debug("New device is", this.device, this.getNewDevice());
    return this.deviceService.createNewDevice(this.getNewDevice(), this.appEui)
      .then((device) => {
        this.createdDevice = device;
      })
      .catch((error) => {
        if (error instanceof BadRequestError) {
          Log.debug("400", error);
          this.formError = error.content;
        } else {
          Log.error("Create device: Error occured", error);
          this.dialogController.cancel();
        }

        throw error;
      });
  }

  fetchSource() {
    return Promise.all([this.deviceService.fetchSourceForDevice(
      this.appEui,
      this.createdDevice.deviceEUI,
      "lopy",
    ).then((lopySource) => {
      this.lopySource = lopySource;
    }),
    this.deviceService.fetchSourceForDevice(
      this.appEui,
      this.createdDevice.deviceEUI,
      "c",
    ).then((cSource) => {
      this.cSource = cSource;
    })]).catch((error) => {
      Log.warn("Something went wrong when fetching source");
      throw error;
    });
  }

  getNewDevice(): NewABPDevice | NewOTAADevice {
    if (this.selectedType === DeviceTypes.OTAA) {
      const otaaDevice: NewOTAADevice = {
        DeviceType: "OTAA",
        RelaxedCounter: this.device.relaxedCounter,
        Tags: this.device.tags,
      };

      return otaaDevice;
    } else {
      const abpDevice: NewABPDevice = {
        DeviceType: "ABP",
        NwkSKey: this.device.nwkSKey.padStart(32, "0"),
        DevAddr: this.device.devAddr,
        AppSKey: this.device.appSKey.padStart(32, "0"),
        RelaxedCounter: this.device.relaxedCounter,
        Tags: this.device.tags,
      };

      return abpDevice;
    }
  }

  isStep(stepNumber: number) {
    return stepNumber === this.step;
  }

  @computedFrom("selectedType")
  get isAbp(): boolean {
    return this.selectedType === DeviceTypes.ABP;
  }

  @computedFrom("step")
  get nextText(): string {
    if (this.isStep(1)) {
      return "Configure device";
    } else if (this.isStep(2)) {
      return "Create device";
    } else {
      return "To new device";
    }
  }

  goToStep(stepNumber: number) {
    Log.debug("Setting step to number", stepNumber);
    if (this.step !== 3) {
      this.step = stepNumber;
    }
  }

  async next(): Promise<any> {
    if (this.isStep(1)) {
      this.step = 2;
      return Promise.resolve();
    } else if (this.isStep(2)) {
      try {
        await this.submitDevice();
        await this.fetchSource();
        this.dialogController.settings.overlayDismiss = false;
        this.step = 3;
      } catch (err) {
        return;
      }
    } else if (this.isStep(3)) {
      return this.dialogController.ok(this.createdDevice);
    }
  }

  cancel() {
    this.dialogController.cancel();
  }

  activate(args) {
    Log.debug("Activating with args:", args);
    this.appEui = args.appEUI;
  }
}
