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
import { autoinject, bindable, PLATFORM } from "aurelia-framework";

import { Output } from "Models/Output";
import { OutputService } from "Services/OutputService";

import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("Output table");

@autoinject
export class ApplicationOutputTable {
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  outputs: Output[];
  @bindable
  applicationEui: string;

  constructor(
    private dialogService: DialogService,
    private outputService: OutputService,
    private eventAggregator: EventAggregator,
  ) { }

  showOutputLog(output: Output) {
    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/outputLogDialog"),
      model: {
        applicationEui: this.applicationEui,
        output: output,
      },
    }).whenClosed((response) => {
      if (!response.wasCancelled) {
        output = response.output;
      }
    });
  }

  editOutput(outputToEdit: Output) {
    const outputUntouched = { ...outputToEdit };

    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/editOutputDialog"),
      model: {
        applicationEui: this.applicationEui,
        output: outputUntouched,
      },
    }).whenClosed((response) => {
      Log.debug("Edit application", response);
      if (!response.wasCancelled) {
        outputToEdit = response.output;
      }
    });
  }

  deleteOutput(outputToBeDeleted: Output) {
    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/messageDialog"),
      model: {
        messageHeader: `Delete ${outputToBeDeleted.config.type}:${outputToBeDeleted.config.endpoint}?`,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      },
    }).whenClosed((response) => {
      if (!response.wasCancelled) {
        Log.debug("Deleting output", outputToBeDeleted);
        this.outputService.deleteOutput(this.applicationEui, outputToBeDeleted.eui).then(() => {
          this.eventAggregator.publish("global:message", {
            body: "Output deleted",
          });
          this.outputs = this.outputs.filter((output) => outputToBeDeleted.eui !== output.eui);
        });
      } else {
        Log.debug("Did not delete output");
      }
    });
  }
}
