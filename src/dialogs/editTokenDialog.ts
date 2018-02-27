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
import { PLATFORM } from "aurelia-pal";

import { TokenService } from "Services/TokenService";

import { LogBuilder } from "Helpers/LogBuilder";
import { BadRequestError } from "Helpers/ResponseHandler";
import { Application } from "Models/Application";
import { Gateway } from "Models/Gateway";
import { Token } from "Models/Token";

const AccessLevels = {
  readonly: false,
  fullaccess: true,
};

const Log = LogBuilder.create("Edit token dialog");

@useView(PLATFORM.moduleName("dialogs/tokenDialog.html"))
@autoinject
export class EditTokenDialog {
  token: Token;

  selectedAccessLevel: string = "readonly";
  selectedResourceAccess: string = "all";
  selectedApplication: string;
  selectedGateway: string;

  applications: Application[] = [];
  gateways: Gateway[] = [];

  dialogHeader = "Update your API key";
  confirmButtonText = "Update API key";
  formError: string;

  constructor(
    private dialogController: DialogController,
    private tokenService: TokenService,
  ) {
    this.token = new Token({
      write: false,
    });
  }

  submitToken() {
    this.token.write = AccessLevels[this.selectedAccessLevel];
    this.token.resource = this.getResourceAccessUrl();

    this.tokenService.updateToken(this.token).then((token) => {
      this.dialogController.ok(token);
    }).catch((error) => {
      if (error instanceof BadRequestError) {
        Log.warn(`${error.errorCode}`, error);
        this.formError = error.content;
      } else {
        Log.error("Create token: Error occured", error);
        this.dialogController.cancel();
      }
    });
  }

  cancel() {
    this.dialogController.cancel();
  }

  activate(args) {
    Log.debug("Args", args);
    this.applications = args.applications;
    this.gateways = args.gateways;
    this.token = args.token;

    this.propagateAccessRightsFromToken(this.token);
  }

  private propagateAccessRightsFromToken(token: Token) {
    const url = token.resource;

    this.selectedAccessLevel = token.write ? "fullaccess" : "readonly";

    if (url === "/") {
      this.selectedResourceAccess = "all";
    } else {
      if (url === "/applications" || url === "/gateways") {
        this.selectedResourceAccess = url.replace("/", "");
        return;
      }

      const accessChunks = url.split("/");

      if (accessChunks[1] === "applications") {
        this.selectedResourceAccess = "specific_application";
        this.selectedApplication = accessChunks[2];
      } else if (accessChunks[1] === "gateways") {
        this.selectedResourceAccess = "specific_gateway";
        this.selectedApplication = accessChunks[2];
      }
    }
  }

  private getResourceAccessUrl(): string {
    const resourceAccess = this.selectedResourceAccess;

    if (resourceAccess === "all") {
      return "/";
    } else {
      if (resourceAccess === "applications" || resourceAccess === "gateways") {
        return `/${resourceAccess}`;
      }

      if (resourceAccess === "specific_application") {
        return `/applications/${this.selectedApplication}`;
      } else if (resourceAccess === "specific_gateway") {
        return `/gateways/${this.selectedGateway}`;
      }
    }
  }
}
