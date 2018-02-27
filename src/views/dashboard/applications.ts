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

import { Application } from "Models/Application";

import { LogBuilder } from "Helpers/LogBuilder";
import { Conflict } from "Helpers/ResponseHandler";
import { TagHelper } from "Helpers/TagHelper";

const Log = LogBuilder.create("Applications");
const th = new TagHelper();

@autoinject
export class Services {
  availableApplications: Application[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private applicationService: ApplicationService,
    private dialogService: DialogService,
    private router: Router,
    private eventAggregator: EventAggregator,
  ) { }

  createNewApplication() {
    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/createApplicationDialog"),
    }).whenClosed((response) => {
      if (!response.wasCancelled) {
        this.eventAggregator.publish("global:message", {
          body: "Application created",
        });
        const newApplication: Application = response.output;
        this.availableApplications.push(newApplication);
        this.router.navigateToRoute("application_details", {
          applicationId: newApplication.appEUI,
        });
      }
    });
  }

  editApplication(application) {
    const applicationUntouched = { ...application };

    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/editApplicationDialog"),
      model: {
        application: applicationUntouched,
      },
    }).whenClosed((response) => {
      Log.debug("Edit application", response);
      if (!response.wasCancelled) {
        this.eventAggregator.publish("global:message", {
          body: "Application updated",
        });
        this.applicationService.fetchApplications().then((applications) => {
          this.availableApplications = applications;
        });
      }
    });
  }

  deleteApplication(application: Application) {
    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/messageDialog"),
      model: {
        messageHeader: `Delete ${th.getTagOrFallback(application, "name", "appEUI", "application")}?`,
        message: `Note: Before you delete the application you must first delete all devices connected to the application.`,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      },
    }).whenClosed((response) => {
      if (!response.wasCancelled) {
        Log.debug("Deleting application");
        this.applicationService.deleteApplication(application).then(() => {
          this.eventAggregator.publish("global:message", {
            body: "Application deleted",
          });
          this.availableApplications = this.availableApplications.filter((app) => app.appEUI !== application.appEUI);
        }).catch((error) => {
          if (error instanceof Conflict) {
            Log.debug("409", error);
            this.eventAggregator.publish("global:message", { body: "Could not delete application due to existing devices.", timeout: 5000 });
          }
        });
      } else {
        Log.debug("Did not delete application");
      }
    });
  }

  fetchAndPopulateApplications() {
    return new Promise((res) => {
      this.applicationService.fetchApplications().then((applications) => {
        this.availableApplications = applications;
        res();
      }).catch((err) => {
        Log.error(err);
        res();
      });
    });
  }

  activate() {
    this.subscriptions.push(this.eventAggregator.subscribe("application:edit", (application) => {
      this.editApplication(application);
    }));
    this.subscriptions.push(this.eventAggregator.subscribe("application:delete", (application) => {
      this.deleteApplication(application);
    }));
    this.subscriptions.push(this.eventAggregator.subscribe("network:selected", (network) => {
      this.fetchAndPopulateApplications();
    }));

    return this.fetchAndPopulateApplications();
  }

  deactivate() {
    this.subscriptions.forEach((subscription) => subscription.dispose());
    this.subscriptions = [];
  }
}
