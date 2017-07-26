import { bindable, autoinject } from 'aurelia-framework';

import { CustomEventHelper } from 'Helpers/CustomEventHelper';
import { LogBuilder } from 'Helpers/LogBuilder';
import { Device } from 'Models/Device';

interface DeviceMarker {
  longitude: number;
  latitude: number;
}

const Log = LogBuilder.create('Device map card');

@autoinject
export class DeviceMapCard {
  @bindable
  device: Device;

  latitude = 63.422064;
  longitude = 10.438485;

  deviceMarkers: DeviceMarker[] = [];

  updating: boolean = false;

  constructor(
    private element: Element
  ) { }

  updateDeviceMarker() {
    this.deviceMarkers = [];

    if (this.device && this.device.tags.location) {
      let [latitude, longitude] = this.device.tags.location.split(',');
      if (longitude && latitude) {
        this.deviceMarkers.push({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        });

        this.latitude = parseFloat(latitude);
        this.longitude = parseFloat(longitude);
      }
    }
  }

  updateLocation() {
    this.updating = true;
  }

  mapEvent(mapEvent: CustomEvent) {
    if (!this.updating) {
      return;
    }
    let latLngDetails = mapEvent.detail.latLng;

    CustomEventHelper.dispatchEvent(
      this.element,
      'new-marker-position',
      {
        bubbles: true,
        detail: {
          latitude: latLngDetails.lat(),
          longitude: latLngDetails.lng()
        }
      }
    );

    this.device.tags.location = `${latLngDetails.lat()},${latLngDetails.lng()}`;
    this.updateDeviceMarker();

    this.updating = false;
    Log.debug('Event', mapEvent.detail);
  }

  deviceChanged() {
    this.updateDeviceMarker();
  }

  bind() {
    this.updateDeviceMarker();
  }
}
