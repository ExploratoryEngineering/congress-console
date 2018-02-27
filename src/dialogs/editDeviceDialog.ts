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
import { autoinject } from "aurelia-framework";

import { Device } from "Models/Device";
import { DeviceService } from "Services/DeviceService";

import { LogBuilder } from "Helpers/LogBuilder";
import { BadRequestError } from "Helpers/ResponseHandler";

const Log = LogBuilder.create("Edit Device Dialog");

@autoinject
export class EditDeviceDialog {
  applicationEui: string;
  device: Device;
  formError: string;

  constructor(
    private dialogController: DialogController,
    private deviceService: DeviceService,
  ) { }

  submitDevice() {
    this.deviceService.updateDevice(this.applicationEui, this.device)
      .then((device) => {
        this.dialogController.ok(device);
      }).catch((error) => {
        if (error instanceof BadRequestError) {
          Log.debug("400", error);
          this.formError = error.content;
        } else {
          Log.error("Edit gateway: Error occured", error);
          this.dialogController.cancel();
        }
      });
  }

  cancel() {
    this.dialogController.cancel();
  }

  activate(args) {
    this.device = args.device;
    this.applicationEui = args.applicationEui;
  }
}
