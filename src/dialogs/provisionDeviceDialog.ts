import { DialogController } from "aurelia-dialog";
import { autoinject, useView } from "aurelia-framework";

import { Device } from "Models/Device";
import { DeviceService } from "Services/DeviceService";

import { LogBuilder } from "Helpers/LogBuilder";
import { BadRequestError } from "Helpers/ResponseHandler";

const Log = LogBuilder.create("Device provision dialog");

@autoinject
export class ProvisionDeviceDialog {
  device: Device;
  appEUI: string;
  source: string;
  sourceTextField;

  constructor(
    private deviceService: DeviceService,
    private dialogController: DialogController,
  ) { }

  ok() {
    this.dialogController.ok();
  }

  activate(args) {
    this.device = args.device;
    this.appEUI = args.appEUI;

    this.deviceService.fetchSourceForDevice(
      this.appEUI,
      this.device.deviceEUI,
    ).then((source) => {
      this.source = source;
    });
  }
}
