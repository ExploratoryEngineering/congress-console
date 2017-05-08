import { useView, autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { GatewayService } from 'Services/GatewayService';
import { Gateway } from 'Models/Gateway';

import { LogBuilder } from 'Helpers/LogBuilder';
import { BadRequestError } from 'Helpers/ResponseHandler';

const Log = LogBuilder.create('Edit gateway dialog');

@useView('./gatewayDialog.html')
@autoinject
export class EditGatewayDialog {
  gateway: Gateway = new Gateway();

  dialogHeader = 'Edit gateway';
  confirmButtonText = 'Update gateway';

  constructor(
    private gatewayService: GatewayService,
    private dialogController: DialogController
  ) { }

  submitGateway() {
    return this.gatewayService.editGateway(this.gateway).then((gateway) => {
      this.dialogController.ok(gateway);
    }).catch(error => {
      if (error instanceof BadRequestError) {
        Log.debug('400', error);
      } else {
        Log.error('Edit gateway: Error occured', error);
        this.dialogController.cancel();
      }
    });
  }
}
