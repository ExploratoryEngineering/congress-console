import { useView } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { ApplicationService } from 'Services/ApplicationService';
import { Application } from 'Models/Application';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Application dialog');

@useView('./applicationDialog.html')
export class CreateApplicationDialog {
  static inject = [ApplicationService, DialogController];

  application = new Application();

  dialogHeader = 'Create your new application';
  confirmButtonText = 'Create new application';

  constructor(applicationService, dialogController) {
    this.applicationService = applicationService;
    this.dialogController = dialogController;
  }

  submitApplication() {
    return this.applicationService.createNewApplication(this.application).then(() => {
      this.dialogController.ok();
    }).catch(error => {
      Log.error('Create application: Error occured', error);
    });
  }
}
