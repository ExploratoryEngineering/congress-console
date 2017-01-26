import { DialogService } from 'aurelia-dialog';
import { Router } from 'aurelia-router';

import { ApplicationService } from 'Services/ApplicationService';

import { CreateApplicationDialog } from 'Dialogs/createApplicationDialog';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Applications');

export class Services {
  static inject = [ApplicationService, DialogService, Router];

  constructor(applicationService, dialogService, router) {
    this.applicationService = applicationService;
    this.dialogService = dialogService;

    this.router = router;
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

  activate() {
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
