import { DialogController } from 'aurelia-dialog';

import { ApplicationService } from 'Services/ApplicationService';
import { Application } from 'Models/Application';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Application dialog');

export class CreateApplicationDialog {
  static inject = [ApplicationService, DialogController];

  application = new Application();

  constructor(applicationService, dialogController) {
    this.applicationService = applicationService;
    this.dialog = dialogController;
  }

  submitApplication() {
    this.applicationService.createNewApplication(this.application).then(() => {
      this.dialog.ok();
    }).catch(error => {
      Log.error('Create application: Error occured', error);
    });
  }

  activate(args) {
    Log.debug('Create application with args', args);
  }
}
