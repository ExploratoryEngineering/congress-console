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

import { bindingMode } from "aurelia-binding";
import { DialogService } from "aurelia-dialog";
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, bindable, PLATFORM, useView } from "aurelia-framework";

import { LogBuilder } from "Helpers/LogBuilder";
import { Device } from "Models/Device";
import { DeviceService } from "Services/DeviceService";

const Log = LogBuilder.create("Device table");

@autoinject
export class DeviceTable {
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  devices: Device[];
  @bindable
  applicationEui: string;
  filteredDevices: Device[] = [];

  constructor(
    private dialogService: DialogService,
    private deviceService: DeviceService,
    private eventAggregator: EventAggregator,
  ) { }

  deleteDevice(device: Device) {
    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/messageDialog"),
      model: {
        messageHeader: "Delete device?",
        message: `Are you sure you want to delete the device with EUI: ${device.deviceEUI}`,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      },
    }).whenClosed((response) => {
      if (!response.wasCancelled) {
        Log.debug("Deleting device");
        this.deviceService.deleteDevice(this.applicationEui, device).then(() => {
          this.eventAggregator.publish("global:message", {
            body: "Device deleted",
          });
          this.devices = this.devices.filter((dev) => dev.deviceEUI !== device.deviceEUI);
        });
      } else {
        Log.debug("Did not delete device");
      }
    });
  }

  filteredDevicesCallback(filteredDevices) {
    this.filteredDevices = filteredDevices;
  }
}
