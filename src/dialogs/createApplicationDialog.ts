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
import { autoinject, PLATFORM, useView } from "aurelia-framework";

import { Application } from "Models/Application";
import { ApplicationService } from "Services/ApplicationService";

import { LogBuilder } from "Helpers/LogBuilder";
import { BadRequestError } from "Helpers/ResponseHandler";

const Log = LogBuilder.create("Application dialog");

@useView(PLATFORM.moduleName("dialogs/applicationDialog.html"))
@autoinject
export class CreateApplicationDialog {
  application: Application = new Application();

  dialogHeader = "Create your new application";
  confirmButtonText = "Create new application";

  formError: string;

  constructor(
    private applicationService: ApplicationService,
    private dialogController: DialogController,
  ) { }

  submitApplication() {
    return this.applicationService.createNewApplication(this.application).then((application) => {
      this.dialogController.ok(application);
    }).catch((error) => {
      if (error instanceof BadRequestError) {
        Log.debug("400", error);
        this.formError = error.content;
      } else {
        Log.error("Create application: Error occured", error);
        this.dialogController.cancel();
      }
    });
  }
}
