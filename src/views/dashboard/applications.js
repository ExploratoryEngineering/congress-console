import { DialogService } from 'aurelia-dialog';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

import { ApplicationService } from 'Services/ApplicationService';

import { CreateApplicationDialog } from 'Dialogs/createApplicationDialog';
import { EditApplicationDialog } from 'Dialogs/editApplicationDialog';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Applications');

export class Services {
  static inject = [ApplicationService, DialogService, Router, EventAggregator];

  constructor(applicationService, dialogService, router, eventAggregator) {
    this.applicationService = applicationService;
    this.dialogService = dialogService;

    this.router = router;
    this.eventAggregator = eventAggregator;
  }

  availableApplications = [];

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

  activate() {
    this.eventAggregator.subscribe('application:edit', (application) => {
      this.editApplication(application);
    });

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
}
