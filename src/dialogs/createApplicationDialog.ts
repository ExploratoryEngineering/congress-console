import { useView, autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { ApplicationService } from 'Services/ApplicationService';
import { Application } from 'Models/Application';

import { LogBuilder } from 'Helpers/LogBuilder';
import { BadRequestError } from 'Helpers/ResponseHandler';

const Log = LogBuilder.create('Application dialog');

@useView('./applicationDialog.html')
@autoinject
export class CreateApplicationDialog {
  application: Application = new Application();

  dialogHeader = 'Create your new application';
  confirmButtonText = 'Create new application';

  constructor(
    private applicationService: ApplicationService,
    private dialogController: DialogController
  ) { }

  submitApplication() {
    return this.applicationService.createNewApplication(this.application).then((application) => {
      this.dialogController.ok(application);
    }).catch(error => {
      if (error instanceof BadRequestError) {
        Log.debug('400', error);
      } else {
        Log.error('Create application: Error occured', error);
        this.dialogController.cancel();
      }
    });
  }
}
