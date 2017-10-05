import { DialogController } from 'aurelia-dialog';
import { autoinject, useView, PLATFORM } from 'aurelia-framework';

import { OutputService } from 'Services/OutputService';
import { Output } from 'Models/Output';
import { BadRequestError } from 'Helpers/ResponseHandler';

@autoinject
@useView(PLATFORM.moduleName('dialogs/outputDialog.html'))
export class EditOutputDialog {
  confirmButtonText: string = 'Update output';
  dialogHeader: string = 'Update output';

  applicationEui: string;
  output: Output = new Output();

  formError: string;

  constructor(
    private outputService: OutputService,
    private dialogController: DialogController
  ) { }

  submitOutput() {
    this.outputService.updateOutput(this.applicationEui, this.output)
      .then((output) => {
        this.dialogController.ok(output);
      }).catch(err => {
        if (err instanceof BadRequestError) {
          this.formError = err.content;
        } else {
          this.dialogController.cancel();
        }
      });
  }

  activate(params) {
    this.applicationEui = params.applicationEui;
    this.output = params.output;
  }
}