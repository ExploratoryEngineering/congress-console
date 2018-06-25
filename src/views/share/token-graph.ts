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

import { autoinject, bindable } from "aurelia-framework";
import { LogBuilder } from "Helpers/LogBuilder";
import { Application, Device, ShareService } from "Services/ShareService";

const Log = LogBuilder.create("Token grapher");

@autoinject
export class TokenGraph {
  @bindable
  token: string = "";

  applications: Application[] = [];
  @bindable
  selectedApplication: string = "";

  application: Application;
  devices: Device[] = [];

  accessToApplications: boolean = false;

  constructor(
    private shareService: ShareService,
  ) { }

  findApplicationsForToken() {
    this.accessToApplications = false;
    this.selectedApplication = "";
    this.devices = [];

    this.shareService.fetchApplicationsWithToken()
      .then((applications) => {
        this.accessToApplications = true;
        this.applications = applications;
      })
      .catch((err) => {
        this.accessToApplications = false;
        Log.debug("Catch", err);
      });
  }

  fetchDevicesForSelectedApplication() {
    this.devices = [];

    this.shareService.fetchApplicationDevicesWithToken(this.selectedApplication)
      .then((devices) => {
        this.devices = devices;
      });
  }

  tokenChanged(token) {
    Log.debug("Setting token", token);
    this.shareService.setAPIToken(token);
    this.resetAll();

    if (token) {
      this.findApplicationsForToken();
    }
  }

  async selectedApplicationChanged(applicationEUI) {
    Log.debug("Application set", applicationEUI);

    this.application = this.applications.find((application) => {
      return application.appEUI === applicationEUI;
    });

    if (!this.application) {
      this.shareService.fetchApplicationWithToken(applicationEUI).then((application) => {
        this.application = application;
      });
    }

    if (applicationEUI) {
      this.fetchDevicesForSelectedApplication();
    }
  }

  private resetAll() {
    this.application = null;
    this.selectedApplication = "";
    this.devices = [];
    this.applications = [];
    this.accessToApplications = false;
  }
}
