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
