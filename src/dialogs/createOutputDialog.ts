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

import { BadRequestError } from "Helpers/ResponseHandler";
import { Output } from "Models/Output";
import { OutputService } from "Services/OutputService";

@autoinject
@useView(PLATFORM.moduleName("dialogs/outputDialog.html"))
export class CreateOutputDialog {
  confirmButtonText: string = "Add output";
  dialogHeader: string = "Add new output";

  applicationEui: string;
  output: Output = new Output({});

  formError: string;

  constructor(
    private outputService: OutputService,
    private dialogController: DialogController,
  ) { }

  submitOutput() {
    this.outputService.createOutput(this.applicationEui, this.output)
      .then((output) => {
        this.dialogController.ok(output);
      }).catch((err) => {
        if (err instanceof BadRequestError) {
          this.formError = err.content;
        } else {
          this.dialogController.cancel();
        }
      });
  }

  activate(params) {
    this.applicationEui = params.applicationEui;
  }
}
