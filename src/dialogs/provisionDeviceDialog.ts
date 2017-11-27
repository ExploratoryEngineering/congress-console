import { DialogController } from "aurelia-dialog";
import { autoinject, useView } from "aurelia-framework";

import { LogBuilder } from "Helpers/LogBuilder";
import { Device } from "Models/Device";
import { DeviceService } from "Services/DeviceService";

const Log = LogBuilder.create("Device provision dialog");

@autoinject
export class ProvisionDeviceDialog {
  device: Device;
  appEUI: string;

  lopySource: string = "";
  cSource: string = "";

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

    return Promise.all([this.deviceService.fetchSourceForDevice(
      this.appEUI,
      this.device.deviceEUI,
      "lopy",
    ).then((lopySource) => {
      this.lopySource = lopySource;
    }),
    this.deviceService.fetchSourceForDevice(
      this.appEUI,
      this.device.deviceEUI,
      "c",
    ).then((cSource) => {
      this.cSource = cSource;
    })]);
  }
}
