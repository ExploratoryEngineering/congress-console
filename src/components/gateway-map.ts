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
    return this.getFilteredGateways().filter(this.isGatewayValid);
  }

  getFilteredGateways(): Gateway[] {
    if (this.search === '') {
      return this.gateways;
    }
    return this.gateways.filter((gw) => {
      return gw.gatewayEUI.includes(this.search);
    });
  }

  private isGatewayValid(gateway: Gateway): boolean {
    return gateway.longitude !== 0 || gateway.latitude !== 0;
  }
}
