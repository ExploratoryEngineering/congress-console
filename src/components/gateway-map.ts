import { computedFrom } from 'aurelia-binding';
import { Gateway } from 'Models/Gateway';
import { bindable } from 'aurelia-framework';

interface GatewayMapMarker {
  longitude: number;
  latitude: number;
}

export class GatewayMap {
  @bindable gateways: Gateway[] = [];
  @bindable search: string = '';

  @computedFrom('gateways', 'search')
  get gatewayMarkers(): GatewayMapMarker[] {
    let markers: GatewayMapMarker[] = [];

    return this.getFilteredGateways().reduce((filteredMarkers, gw) => {
      if (this.isGatewayValid(gw)) {
        filteredMarkers.push({
          longitude: gw.longitude,
          latitude: gw.latitude
        });
      }

      return filteredMarkers;
    }, markers);
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

  private isGatewayValid(gateway: Gateway): boolean {
    return gateway.longitude !== 0 || gateway.latitude !== 0;
  }
}
