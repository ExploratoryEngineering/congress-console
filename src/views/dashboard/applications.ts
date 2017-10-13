import { autoinject, PLATFORM } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Router } from 'aurelia-router';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

import { ApplicationService } from 'Services/ApplicationService';

import { Application } from 'Models/Application';

import { TagHelper } from 'Helpers/TagHelper';
import { LogBuilder } from 'Helpers/LogBuilder';
import { Conflict } from 'Helpers/ResponseHandler';

const Log = LogBuilder.create('Applications');
const th = new TagHelper();

@autoinject
export class Services {
  subscriptions: Subscription[] = [];

  constructor(
    private applicationService: ApplicationService,
    private dialogService: DialogService,
    private router: Router,
    private eventAggregator: EventAggregator
  ) { }

  availableApplications: Application[] = [];

  createNewApplication() {
    this.dialogService.open({
      viewModel: PLATFORM.moduleName('dialogs/createApplicationDialog')
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        this.eventAggregator.publish('global:message', {
          body: 'Application created'
        });
        const newApplication: Application = response.output;
        this.availableApplications.push(newApplication);
        this.router.navigateToRoute('application_details', {
          applicationId: newApplication.appEUI
        });
      }
    });
  }

  editApplication(application) {
    let applicationUntouched = { ...application };

    this.dialogService.open({
      viewModel: PLATFORM.moduleName('dialogs/editApplicationDialog'),
      model: {
        application: applicationUntouched
      }
    }).whenClosed(response => {
      Log.debug('Edit application', response);
      if (!response.wasCancelled) {
        this.eventAggregator.publish('global:message', {
          body: 'Application updated'
        });
        this.applicationService.fetchApplications().then(applications => {
          this.availableApplications = applications;
        });
      }
    });
  }

  deleteApplication(application: Application) {
    this.dialogService.open({
      viewModel: PLATFORM.moduleName('dialogs/messageDialog'),
      model: {
        messageHeader: `Delete ${th.getTagOrFallback(application, 'name', 'appEUI', 'application')}?`,
        message: `Note: Before you delete the application you must first delete all devices connected to the application.`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        Log.debug('Deleting application');
        this.applicationService.deleteApplication(application).then(() => {
          this.eventAggregator.publish('global:message', {
            body: 'Application deleted'
          });
          this.availableApplications = this.availableApplications.filter(app => app.appEUI !== application.appEUI);
        }).catch((error) => {
          if (error instanceof Conflict) {
            Log.debug('409', error);
            this.eventAggregator.publish('global:message', { body: 'Could not delete application due to existing devices.', timeout: 5000 });
          }
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
