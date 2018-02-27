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
import { DialogService } from "aurelia-dialog";
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, PLATFORM } from "aurelia-framework";
import { Router } from "aurelia-router";

import { ApplicationService } from "Services/ApplicationService";
import { DeviceService } from "Services/DeviceService";

import { Application } from "Models/Application";
import { Device } from "Models/Device";

import { LogBuilder } from "Helpers/LogBuilder";
const Log = LogBuilder.create("Application devices");

@autoinject
export class ApplicationDevices {
  router: Router;

  application: Application = new Application();
  allApplications: Application[] = [];
  selectableApplications: Application[] = [];

  devices: Device[] = [];

  constructor(
    private applicationService: ApplicationService,
    private deviceService: DeviceService,
    private dialogService: DialogService,
    private eventAggregator: EventAggregator,
    router: Router,
  ) {
    this.router = router;
  }

  createNewDevice() {
    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/createDeviceDialog"),
      model: {
        appEUI: this.application.appEUI,
      },
    }).whenClosed((response) => {
      if (!response.wasCancelled) {
        this.eventAggregator.publish("global:message", {
          body: "Device created",
        });
        this.devices.push(response.output);
        this.router.navigateToRoute("application_device", {
          applicationId: this.application.appEUI,
          deviceId: response.output.deviceEUI,
        });
      }
    });
  }

  @computedFrom("devices")
  get hasDevicesWithWarnings(): boolean {
    return this.devices.some((device) => {
      return device.keyWarning;
    });
  }

  activate(args) {
    return Promise.all([
      this.applicationService.fetchApplications().then((applications) => {
        this.allApplications = applications;

        const selectedApplication = this.allApplications.find((application) => {
          return application.appEUI === args.applicationId;
        });

        if (selectedApplication) {
          this.application = selectedApplication;
        } else {
          return;
        }

        this.selectableApplications = this.allApplications.filter((application) => {
          return application.appEUI !== this.application.appEUI;
        });
      }),
      this.deviceService.fetchDevices(args.applicationId).then((devices) => {
        this.devices = devices;
      }),
    ]).catch((err) => {
      Log.error(err);
      this.router.navigate("");
    });
  }
}
