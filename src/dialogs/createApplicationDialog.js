import { DialogController } from 'aurelia-dialog';

import { ApplicationService } from 'Services/ApplicationService';
import { Application } from 'Models/Application';

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
      console.error('Create application: Error occured', error);
    });
  }

  activate(args) {
    console.log('Create application with args', args);
  }
}
