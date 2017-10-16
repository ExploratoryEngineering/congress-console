import { useView, autoinject, PLATFORM } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

import { GatewayService } from 'Services/GatewayService';
import { Gateway } from 'Models/Gateway';

import { LogBuilder } from 'Helpers/LogBuilder';
import { BadRequestError } from 'Helpers/ResponseHandler';

const Log = LogBuilder.create('Edit gateway dialog');

interface TagMarker {
  longitude: number;
  latitude: number;
}

@useView(PLATFORM.moduleName('dialogs/gatewayDialog.html'))
@autoinject
export class EditGatewayDialog {
  gateway: Gateway = new Gateway();
  mapMarkers: TagMarker[] = [];

  dialogHeader = 'Edit gateway';
  confirmButtonText = 'Update gateway';

  latitude = 63.422064;
  longitude = 10.438485;

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

  mapClickEvent(mapEvent: CustomEvent) {
    Log.debug('Mapevent', mapEvent);

    let latLngDetails = mapEvent.detail.latLng;

    this.gateway.latitude = latLngDetails.lat();
    this.gateway.longitude = latLngDetails.lng();

    Log.debug('Event', mapEvent.detail);
    this.setGatewayMarker();
  }

  activate(params) {
    this.gateway = params.gateway;
    if (this.hasLocation()) {
      this.longitude = this.gateway.longitude;
      this.latitude = this.gateway.latitude;
    }
    this.setGatewayMarker();
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
}
