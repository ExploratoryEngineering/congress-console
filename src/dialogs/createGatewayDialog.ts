import { useView, autoinject, PLATFORM } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { GatewayService } from 'Services/GatewayService';
import { Gateway } from 'Models/Gateway';

import { LogBuilder } from 'Helpers/LogBuilder';
import { BadRequestError, Conflict } from 'Helpers/ResponseHandler';

const Log = LogBuilder.create('Create gateway dialog');

@useView(PLATFORM.moduleName('dialogs/gatewayDialog.html'))
@autoinject
export class CreateGatewayDialog {
  gateway: Gateway = new Gateway();

  dialogHeader = 'Create your new gateway';
  confirmButtonText = 'Create new gateway';
  formError: string;

  constructor(
    private gatewayService: GatewayService,
    private dialogController: DialogController
  ) {
    Log.debug('Asking for current position');
    navigator.geolocation.getCurrentPosition((positionCallback) => this.setCurrentPosition(positionCallback), (err) => {
      Log.warn('Could not get position for user', err);
    });
  }

  private setCurrentPosition(position: Position) {
    this.gateway.latitude = position.coords.latitude;
    this.gateway.longitude = position.coords.longitude;
    this.gateway.altitude = position.coords.altitude ? position.coords.altitude : 0;
  }

  submitGateway() {
    return this.gatewayService.createNewGateway(this.gateway).then((gateway) => {
      this.dialogController.ok(gateway);
    }).catch(error => {
      if (error instanceof BadRequestError || error instanceof Conflict) {
        Log.warn(`${error.errorCode}`, error);
        this.formError = error.content;
      } else {
        Log.error('Create gateway: Error occured', error);
        this.dialogController.cancel();
      }
    });
  }
}
