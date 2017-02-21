import { useView, autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { ApplicationService } from 'Services/ApplicationService';
import { Application } from 'Models/Application';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Application dialog');

@useView('./applicationDialog.html')
@autoinject
export class EditApplicationDialog {
  application: Application = new Application();

  dialogHeader = 'Edit application';
  confirmButtonText = 'Update application';

  constructor(
    private applicationService: ApplicationService,
    private dialogController: DialogController
  ) { }

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
