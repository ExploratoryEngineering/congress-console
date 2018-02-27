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
import { autoinject } from "aurelia-framework";
import { Output } from "Models/Output";
import { OutputService } from "Services/OutputService";

const POLL_INTERVAL_MS = 10000;

@autoinject
export class OutputLogDialog {
  output: Output;
  applicationEui: string;

  intervalId: number;

  constructor(
    private dialogController: DialogController,
    private outputService: OutputService,
  ) { }

  update() {
    return this.outputService.getOutputByEui(this.applicationEui, this.output.eui).then((output) => {
      this.output = output;
    });
  }

  close() {
    this.dialogController.ok(this.output);
  }

  activate(args) {
    this.output = args.output;
    this.applicationEui = args.applicationEui;

    this.intervalId = window.setInterval(() => { this.update(); }, POLL_INTERVAL_MS);
  }

  deactivate() {
    window.clearInterval(this.intervalId);
  }
}
