import { DialogService } from 'aurelia-dialog';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

import { ApplicationService } from 'Services/ApplicationService';

import { Application } from 'Models/Application';

import { CreateApplicationDialog } from 'Dialogs/createApplicationDialog';
import { EditApplicationDialog } from 'Dialogs/editApplicationDialog';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Applications');

export class Services {
  static inject = [ApplicationService, DialogService, Router, EventAggregator];

  applicationService: ApplicationService;
  dialogService: DialogService;
  router: Router;
  eventAggregator: EventAggregator;

  subscriptions: any = [];

  constructor(applicationService, dialogService, router, eventAggregator) {
    this.applicationService = applicationService;
    this.dialogService = dialogService;

    this.router = router;
    this.eventAggregator = eventAggregator;
  }

  availableApplications: Application[] = [];

  createNewApplication() {
    this.dialogService.open({ viewModel: CreateApplicationDialog }).then(response => {
      if (!response.wasCancelled) {
        this.applicationService.fetchApplications().then(applications => {
          this.availableApplications = applications;
        });
      }
    });
  }

  editApplication(application) {
    let applicationUntouched = Object.assign({}, application);

    this.dialogService.open({
      viewModel: EditApplicationDialog,
      model: {
        application: applicationUntouched
      }
    }).then(response => {
      Log.debug('Edit application', response);
      if (!response.wasCancelled) {
        this.applicationService.fetchApplications().then(applications => {
          this.availableApplications = applications;
        });
      }
    });
  }

  fetchAndPopulateApplications() {
    return new Promise((res) => {
      this.applicationService.fetchApplications().then(applications => {
        this.availableApplications = applications;
        res();
      }).catch(err => {
        Log.error(err);
        res();
      });
    });
  }

  activate() {
    this.subscriptions.push(this.eventAggregator.subscribe('application:edit', (application) => {
      this.editApplication(application);
    }));
    this.subscriptions.push(this.eventAggregator.subscribe('network:selected', (network) => {
      this.fetchAndPopulateApplications();
    }));

    return this.fetchAndPopulateApplications();
  }

  deactivate() {
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.subscriptions = [];
  }
}
