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

import { autoinject, bindable, containerless } from "aurelia-framework";

import { Output } from "Models/Output";
import { OutputService } from "Services/OutputService";

import "./application-output-card.scss";

@autoinject
@containerless
export class ApplicationOutputCard {
  @bindable
  applicationEui: string;

  outputs: Output[] = [];

  constructor(
    private outputService: OutputService,
  ) { }

  fetchAndPopulateOutputs() {
    this.outputService.getOutputsForApplication(
      this.applicationEui,
    ).then((outputs) => {
      this.outputs = outputs;
    });
  }

  bind() {
    this.fetchAndPopulateOutputs();
  }

  applicationEuiChanged() {
    this.fetchAndPopulateOutputs();
  }
}
