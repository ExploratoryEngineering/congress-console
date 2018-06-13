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
import { autoinject, bindable, PLATFORM } from "aurelia-framework";
import { Router } from "aurelia-router";

import { ApplicationService } from "Services/ApplicationService";
import { DeviceService } from "Services/DeviceService";

import { Application } from "Models/Application";
import { Device } from "Models/Device";

import { ApplicationStream } from "Helpers/ApplicationStream";
import { LogBuilder } from "Helpers/LogBuilder";
import { WebsocketDeviceDataMessage } from "Helpers/Websocket";

const Log = LogBuilder.create("Application details");

@autoinject
export class ApplicationDetails {
  router: Router;

  application: Application = new Application();
  allApplications: Application[] = [];
  selectableApplications: Application[] = [];
  subscriptions: Subscription[] = [];

  devices: Device[] = [];

  constructor(
    private applicationService: ApplicationService,
    private deviceService: DeviceService,
    private eventAggregator: EventAggregator,
    private dialogService: DialogService,
    private applicationStream: ApplicationStream,
    router: Router,
  ) {
    this.router = router;
  }

  editApplication(application: Application) {
    const applicationUntouched = { ...application };

    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/editApplicationDialog"),
      model: {
        application: applicationUntouched,
      },
    }).whenClosed((response) => {
      Log.debug("Edit application", response);
      if (!response.wasCancelled) {
        this.application = response.output;
      }
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
    ]).then(() => {
      this.subscriptions.push(this.eventAggregator.subscribe("application:edit", (application: Application) => {
        this.editApplication(application);
      }));
      this.applicationStream.openApplicationDataStream(this.application.appEUI);
    }).catch((err) => {
      Log.error(err);
      this.router.navigate("");
    });
  }

  deactivate() {
    this.subscriptions.forEach((subscription) => subscription.dispose());
    this.subscriptions = [];
    this.applicationStream.closeApplicationStream();
  }
}
