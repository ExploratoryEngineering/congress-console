import { useView, autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { GatewayService } from 'Services/GatewayService';
import { Gateway } from 'Models/Gateway';

import { LogBuilder } from 'Helpers/LogBuilder';
import { BadRequestError } from 'Helpers/ResponseHandler';

const Log = LogBuilder.create('Create gateway dialog');

@useView('./gatewayDialog.html')
@autoinject
export class CreateGatewayDialog {
  gateway: Gateway = new Gateway();

  dialogHeader = 'Create your new gateway';
  confirmButtonText = 'Create new gateway';

  constructor(
    private gatewayService: GatewayService,
    private dialogController: DialogController
  ) { }

  submitGateway() {
    return this.gatewayService.createNewGateway(this.gateway).then((gateway) => {
      this.dialogController.ok(gateway);
    }).catch(error => {
      if (error instanceof BadRequestError) {
        Log.debug('400', error);
      } else {
        Log.error('Create gateway: Error occured', error);
        this.dialogController.cancel();
      }
    });
  }
}
