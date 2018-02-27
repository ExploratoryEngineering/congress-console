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
