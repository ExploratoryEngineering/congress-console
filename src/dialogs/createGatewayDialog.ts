/*
	Copyright 2018 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

import { DialogController } from "aurelia-dialog";
import { autoinject, PLATFORM, useView } from "aurelia-framework";

import { Gateway } from "Models/Gateway";
import { GatewayService } from "Services/GatewayService";

import { LogBuilder } from "Helpers/LogBuilder";
import { BadRequestError, Conflict } from "Helpers/ResponseHandler";

const Log = LogBuilder.create("Create gateway dialog");

interface TagMarker {
  longitude: number;
  latitude: number;
}

@useView(PLATFORM.moduleName("dialogs/gatewayDialog.html"))
@autoinject
export class CreateGatewayDialog {
  gateway: Gateway = new Gateway();
  mapMarkers: TagMarker[] = [];

  dialogHeader = "Create your new gateway";
  confirmButtonText = "Create new gateway";
  formError: string;

  latitude = 63.422064;
  longitude = 10.438485;

  constructor(
    private gatewayService: GatewayService,
    private dialogController: DialogController,
  ) {
    Log.debug("Asking for current position");
    navigator.geolocation.getCurrentPosition((positionCallback) => this.setCurrentPosition(positionCallback), (err) => {
      Log.warn("Could not get position for user", err);
    });
  }

  mapClickEvent(mapEvent: CustomEvent) {
    Log.debug("Mapevent", mapEvent);

    const latLngDetails = mapEvent.detail.latLng;

    this.gateway.latitude = latLngDetails.lat();
    this.gateway.longitude = latLngDetails.lng();

    Log.debug("Event", mapEvent.detail);
    this.setGatewayMarker();
  }

  submitGateway() {
    return this.gatewayService.createNewGateway(this.gateway).then((gateway) => {
      this.dialogController.ok(gateway);
    }).catch((error) => {
      if (error instanceof BadRequestError || error instanceof Conflict) {
        Log.warn(`${error.errorCode}`, error);
        this.formError = error.content;
      } else {
        Log.error("Create gateway: Error occured", error);
        this.dialogController.cancel();
      }
    });
  }

  private setCurrentPosition(position: Position) {
    Log.debug("Setting current position", position);
    if (this.isNewGateway()) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    }
  }

  private setGatewayMarker() {
    this.mapMarkers = [{
      longitude: this.gateway.longitude,
      latitude: this.gateway.latitude,
    }];
  }

  private isNewGateway(): boolean {
    return this.gateway.gatewayEUI === "";
  }

}
