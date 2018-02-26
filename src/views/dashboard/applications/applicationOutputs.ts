
import { computedFrom } from "aurelia-binding";
import { DialogService } from "aurelia-dialog";
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, PLATFORM } from "aurelia-framework";
import { Router } from "aurelia-router";

import { Application } from "Models/Application";
import { Output } from "Models/Output";
import { ApplicationService } from "Services/ApplicationService";
import { OutputService } from "Services/OutputService";

import { LogBuilder } from "Helpers/LogBuilder";
const Log = LogBuilder.create("Application devices");

@autoinject
export class ApplicationOutputs {
  router: Router;

  outputs: Output[] = [];

  application: Application = new Application();
  allApplications: Application[] = [];
  selectableApplications: Application[] = [];

  constructor(
    private applicationService: ApplicationService,
    private outputService: OutputService,
    private dialogService: DialogService,
    private eventAggregator: EventAggregator,
    router: Router,
  ) {
    this.router = router;
  }

  createNewOutput() {
    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/createOutputDialog"),
      model: {
        applicationEui: this.application.appEUI,
      },
    }).whenClosed((response) => {
      if (!response.wasCancelled) {
        this.eventAggregator.publish("global:message", {
          body: "Output created",
        });
        this.outputs.push(response.output);
      }
    });
  }

  @computedFrom("application")
  get curlWebsocketExample() {
    // tslint:disable-next-line:max-line-length
    return `curl -i -N -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" -H "X-API-Token: YOUR_API_TOKEN" -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Host: api.lora.telenor.io" -H "Origin: https://api.lora.telenor.io" https://api.lora.telenor.io/applications/${this.application.appEUI}/stream`;
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
      }).then(() => {
        this.outputService.getOutputsForApplication(this.application.appEUI).then((outputs) => {
          this.outputs = outputs;
        });
      }),
    ]).catch((err) => {
      Log.error(err);
      this.router.navigate("");
    });
  }
}
