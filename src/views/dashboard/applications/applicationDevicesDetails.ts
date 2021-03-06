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

import { DialogService } from "aurelia-dialog";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, PLATFORM } from "aurelia-framework";
import { Router } from "aurelia-router";

import { ApplicationService } from "Services/ApplicationService";
import { DeviceService } from "Services/DeviceService";

import { Application } from "Models/Application";
import { Device } from "Models/Device";

import { ApplicationStream } from "Helpers/ApplicationStream";
import { LogBuilder } from "Helpers/LogBuilder";
import { BadRequestError, Conflict } from "Helpers/ResponseHandler";

const Log = LogBuilder.create("Application devices");

@autoinject
export class ApplicationDevicesDetails {
  router: Router;

  application: Application = new Application();
  allApplications: Application[] = [];
  selectableApplications: Application[] = [];

  subscriptions: Subscription[] = [];
  device: Device;

  constructor(
    private applicationService: ApplicationService,
    private deviceService: DeviceService,
    private dialogService: DialogService,
    private eventAggregator: EventAggregator,
    private applicationStream: ApplicationStream,
    router: Router,
  ) {
    this.router = router;
  }

  editDevice() {
    Log.debug("Editing", this.device);
    const untouchedDevice = { ...this.device };

    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/editDeviceDialog"),
      model: {
        applicationEui: this.application.appEUI,
        device: untouchedDevice,
      },
    }).whenClosed((response) => {
      if (!response.wasCancelled) {
        this.eventAggregator.publish("global:message", {
          body: "Device updated",
        });
        this.device = response.output;
      } else {
        Log.debug("Did not edit device");
      }
    });
  }

  deleteDevice() {
    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/messageDialog"),
      model: {
        messageHeader: "Delete device?",
        message: `Are you sure you want to delete the device with EUI: ${this.device.deviceEUI}`,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      },
    }).whenClosed((response) => {
      if (!response.wasCancelled) {
        Log.debug("Deleting device");
        this.deviceService.deleteDevice(this.application.appEUI, this.device).then(() => {
          this.eventAggregator.publish("global:message", {
            body: "Device deleted",
          });
          this.router.navigateToRoute("application_devices", {
            applicationId: this.application.appEUI,
          });
        });
      } else {
        Log.debug("Did not delete device");
      }
    });
  }

  updatePositionTag(event: CustomEvent) {
    Log.debug("Updating position tag", event);

    if (this.device.tags.location) {
      this.editTag(this.device, {
        key: "location",
        value: `${event.detail.latitude},${event.detail.longitude}`,
      });
    } else {
      this.addTag(this.device, {
        key: "location",
        value: `${event.detail.latitude},${event.detail.longitude}`,
      });
    }
  }

  showDeviceProvisionDetails(event: CustomEvent) {
    Log.debug("User wants to provision device", this.device);
    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/provisionDeviceDialog"),
      model: {
        appEUI: this.application.appEUI,
        device: this.device,
      },
    });
  }

  addTag(device: Device, tag: Tag) {
    return this.deviceService.addTagToDevice(this.application.appEUI, device.deviceEUI, tag).then((tagObject) => {
      device.tags = { ...device.tags, ...tagObject };
      this.device = { ...device };
      this.eventAggregator.publish("global:message", { body: "Tag created" });
    }).catch((error) => {
      if (error instanceof Conflict) {
        this.eventAggregator.publish("global:message", { body: `Tag with key "${tag.key}" already exists.` });
      } else if (error instanceof BadRequestError) {
        this.eventAggregator.publish("global:message", { body: error.content });
      }
    });
  }

  editTag(device: Device, tag: Tag) {
    return this.deviceService.deleteTagFromDevice(this.application.appEUI, device.deviceEUI, tag).then(() => {
      return this.addTag(device, tag);
    });
  }

  deleteTag(device: Device, tag: Tag) {
    return this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/messageDialog"),
      model: {
        messageHeader: "Delete tag?",
        message: `Are you sure you want to delete the tag: ${tag.key}:${tag.value}`,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      },
    }).whenClosed((response) => {
      if (!response.wasCancelled) {
        this.deviceService.deleteTagFromDevice(this.application.appEUI, device.deviceEUI, tag).then(() => {
          delete device.tags[tag.key];
          this.device = { ...device };
          this.eventAggregator.publish("global:message", {
            body: "Tag deleted",
          });
        });
      } else {
        Log.debug("Did not delete tag");
      }
    });
  }

  activate(args) {
    this.subscriptions.push(this.eventAggregator.subscribe("device:tag:new", ({ model, tag }) => {
      this.addTag(model, tag);
    }));
    this.subscriptions.push(this.eventAggregator.subscribe("device:tag:edit", ({ model, tag }) => {
      this.editTag(model, tag);
    }));
    this.subscriptions.push(this.eventAggregator.subscribe("device:tag:delete", ({ model, tag }) => {
      this.deleteTag(model, tag);
    }));

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
      this.deviceService.fetchDeviceByEUI(args.applicationId, args.deviceId).then((device) => {
        this.device = device;
      }),
    ]).then(() => {
      this.applicationStream.openApplicationDataStream(this.application.appEUI);
    }).catch((err) => {
      Log.error(err);
      this.router.navigateToRoute("application_devices", {
        applicationId: this.application.appEUI,
      });
    });
  }

  deactivate() {
    this.subscriptions.forEach((subscription) => subscription.dispose());
    this.subscriptions = [];
    this.applicationStream.closeApplicationStream();
  }
}
