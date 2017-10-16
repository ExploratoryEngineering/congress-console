import { useView, autoinject, PLATFORM } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { GatewayService } from 'Services/GatewayService';
import { Gateway } from 'Models/Gateway';

import { LogBuilder } from 'Helpers/LogBuilder';
import { BadRequestError, Conflict } from 'Helpers/ResponseHandler';

const Log = LogBuilder.create('Create gateway dialog');

interface TagMarker {
  longitude: number;
  latitude: number;
}

@useView(PLATFORM.moduleName('dialogs/gatewayDialog.html'))
@autoinject
export class CreateGatewayDialog {
  gateway: Gateway = new Gateway();
  mapMarkers: TagMarker[] = [];


  dialogHeader = 'Create your new gateway';
  confirmButtonText = 'Create new gateway';
  formError: string;

  latitude = 63.422064;
  longitude = 10.438485;

  constructor(
    private gatewayService: GatewayService,
    private dialogController: DialogController
  ) {
    Log.debug('Asking for current position');
    navigator.geolocation.getCurrentPosition((positionCallback) => this.setCurrentPosition(positionCallback), (err) => {
      Log.warn('Could not get position for user', err);
    });
  }

  mapClickEvent(mapEvent: CustomEvent) {
    Log.debug('Mapevent', mapEvent);

    let latLngDetails = mapEvent.detail.latLng;

    this.gateway.latitude = latLngDetails.lat();
    this.gateway.longitude = latLngDetails.lng();

    Log.debug('Event', mapEvent.detail);
    this.setGatewayMarker();
  }

  private setCurrentPosition(position: Position) {
    if (!this.hasLocation) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    }
  }

  private setGatewayMarker() {
    if (this.hasLocation()) {
      this.mapMarkers = [{
        longitude: this.gateway.longitude,
        latitude: this.gateway.latitude
      }];
    }
  }

  private hasLocation(): boolean {
    return !!(this.gateway.latitude && this.gateway.longitude);
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
