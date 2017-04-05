import { autoinject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

import { ApplicationService } from 'Services/ApplicationService';

import { Application } from 'Models/Application';

import { CreateApplicationDialog } from 'Dialogs/createApplicationDialog';
import { EditApplicationDialog } from 'Dialogs/editApplicationDialog';
import { MessageDialog } from 'Dialogs/messageDialog';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Applications');

@autoinject
export class Services {
  subscriptions: any = [];

  constructor(
    private applicationService: ApplicationService,
    private dialogService: DialogService,
    private router: Router,
    private eventAggregator: EventAggregator
  ) { }

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

  deleteApplication(application: Application) {
    this.dialogService.open({
      viewModel: MessageDialog,
      model: {
        messageHeader: `Delete ${application.name}?`,
        message: `Note: Before you delete the application you must first delete all devices connected to the application.`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    }).then(response => {
      if (!response.wasCancelled) {
        Log.debug('Deleting application');
        this.applicationService.deleteApplication(application).then(() => {
          this.availableApplications = this.availableApplications.filter(app => app.appEUI !== application.appEUI);
        });
      } else {
        Log.debug('Did not delete application');
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
    this.subscriptions.push(this.eventAggregator.subscribe('application:delete', (application) => {
      this.deleteApplication(application);
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
