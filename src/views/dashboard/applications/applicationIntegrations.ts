import { computedFrom } from 'aurelia-binding';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { ApplicationService } from 'Services/ApplicationService';
import { Application } from 'Models/Application';

import { LogBuilder } from 'Helpers/LogBuilder';
const Log = LogBuilder.create('Application devices');

@autoinject
export class ServiceDetails {
  application: Application = new Application();
  allApplications: Application[] = [];
  selectableApplications: Application[] = [];

  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) { }

  @computedFrom('application')
  get wstaCodeExample() {
    return `wsta -I
    wss://api.lora.telenor.io/applications/${this.application.appEUI}/stream
    -H X-API-Token:YOUR-API-TOKEN`;
  }

  @computedFrom('application')
  get wstaCodeExampleWithJqPipe() {
    return `wsta -I
    wss://api.lora.telenor.io/applications/${this.application.appEUI}/stream
    -H X-API-Token:YOUR-API-TOKEN
    | jq  .type`;
  }

  activate(args) {
    return Promise.all([
      this.applicationService.fetchApplications().then((applications) => {
        this.allApplications = applications;

        let selectedApplication = this.allApplications.find((application) => {
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
      })
    ]).catch(err => {
      Log.error(err);
      this.router.navigate('');
    });
  }
}
