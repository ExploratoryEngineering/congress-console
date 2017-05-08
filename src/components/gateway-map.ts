import { computedFrom } from 'aurelia-binding';
import { Gateway } from 'Models/Gateway';
import { bindable } from 'aurelia-framework';

interface GatewayMapMarkers {
  longitude: number;
  latitude: number;
}

export class GatewayMap {
  @bindable gateways: Gateway[] = [];
  @bindable search: string = '';

  positions = [{
    longitude: 10.437812,
    latitude: 63.421531
  }, {
    longitude: 10.432240,
    latitude: 63.422348
  }];

  @computedFrom('gateways', 'search')
  get gatewayMarkers(): GatewayMapMarkers[] {
    return this.getFilteredGateways().map((gw, idx) => {
      return {
        longitude: this.positions[idx % this.positions.length].longitude,
        latitude: this.positions[idx % this.positions.length].latitude,
        title: `Gateway EUI: ${gw.gatewayEUI}`
      };
    });
  }

  getFilteredGateways(): Gateway[] {
    if (this.search === '') {
      return this.gateways;
    }

    let filteredGateways: Gateway[] = [];

    return this.gateways.reduce((gws, gw) => {
      if (gw.gatewayEUI.includes(this.search)) {
        gws.push(gw);
      }
      return gws;
    }, filteredGateways);
  }


}
