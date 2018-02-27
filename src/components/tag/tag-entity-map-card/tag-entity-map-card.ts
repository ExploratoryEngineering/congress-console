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

import { autoinject, bindable } from "aurelia-framework";
import { DOM } from "aurelia-pal";

import { LogBuilder } from "Helpers/LogBuilder";

interface TagMarker {
  longitude: number;
  latitude: number;
}

const Log = LogBuilder.create("Device map card");

@autoinject
export class TagEntityMapCard {
  @bindable
  tagEntity: TagEntity;

  latitude = 63.422064;
  longitude = 10.438485;

  tagEntityMarkers: TagMarker[] = [];

  updating: boolean = false;

  constructor(
    private element: Element,
  ) { }

  updateTagEntityMarker() {
    this.tagEntityMarkers = [];

    if (this.tagEntity && this.tagEntity.tags.location) {
      const [latitude, longitude] = this.tagEntity.tags.location.split(",");
      if (longitude && latitude) {
        this.tagEntityMarkers.push({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        });

        this.latitude = parseFloat(latitude);
        this.longitude = parseFloat(longitude);
      }
    }
  }

  updateLocation() {
    this.updating = true;
  }

  mapClickEvent(mapEvent: CustomEvent) {
    if (!this.updating) {
      return;
    }
    const latLngDetails = mapEvent.detail.latLng;

    this.element.dispatchEvent(DOM.createCustomEvent(
      "new-marker-position",
      {
        bubbles: true,
        detail: {
          latitude: latLngDetails.lat(),
          longitude: latLngDetails.lng(),
        },
      },
    ));

    this.tagEntity.tags.location = `${latLngDetails.lat()},${latLngDetails.lng()}`;
    this.updateTagEntityMarker();

    this.updating = false;
    Log.debug("Event", mapEvent.detail);
  }

  tagEntityChanged() {
    this.updateTagEntityMarker();
  }

  bind() {
    this.updateTagEntityMarker();
  }
}
