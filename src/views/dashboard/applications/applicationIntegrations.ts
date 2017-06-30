import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { TokenService } from 'Services/TokenService';
import { ApplicationService } from 'Services/ApplicationService';

import { Application } from 'Models/Application';
import { Token } from 'Models/Token';

import { MessageDialog } from 'Dialogs/messageDialog';
import { CreateTokenDialog } from 'Dialogs/createTokenDialog';

import { LogBuilder } from 'Helpers/LogBuilder';
const Log = LogBuilder.create('Application devices');

@autoinject
export class ServiceDetails {
  application: Application = new Application();
  allApplications: Application[] = [];
  selectableApplications: Application[] = [];

  tokens: Token[];
  subscriptions: any[] = [];

  constructor(
    private applicationService: ApplicationService,
    private tokenService: TokenService,
    private eventAggregator: EventAggregator,
    private dialogService: DialogService,
    private router: Router
  ) { }

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
