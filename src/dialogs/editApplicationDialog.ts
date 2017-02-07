import { useView } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { ApplicationService } from 'Services/ApplicationService';
import { Application } from 'Models/Application';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Application dialog');

@useView('./applicationDialog.html')
export class EditApplicationDialog {
  static inject = [ApplicationService, DialogController];

  applicationService: ApplicationService;
  dialogController: DialogController;

  application: Application = new Application();

  dialogHeader = 'Edit application';
  confirmButtonText = 'Update application';

  constructor(applicationService, dialogController) {
    this.applicationService = applicationService;
    this.dialogController = dialogController;
  }

  submitApplication() {
    return this.applicationService.updateApplication(this.application).then(() => {
      this.dialogController.ok(this.application);
    }).catch(error => {
      Log.error('Create application: Error occured', error);
    });
  }

  activate(args) {
    this.application = args.application;
  }
}