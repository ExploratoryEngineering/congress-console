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
