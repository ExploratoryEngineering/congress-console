import { computedFrom } from "aurelia-binding";
import { bindable } from "aurelia-framework";
import { TagHelper } from "Helpers/TagHelper";
import { Gateway } from "Models/Gateway";

interface GatewayMapMarker {
  longitude: number;
  latitude: number;
  title: string;
}

const th = new TagHelper();

export class GatewayMap {
  @bindable gateways: Gateway[] = [];
  @bindable search: string = "";

  latitude = 63.422064;
  longitude = 10.438485;

  @computedFrom("gateways", "search")
  get gatewayMarkers(): GatewayMapMarker[] {
    return this.getFilteredGateways().filter(this.isGatewayValid).map((gw) => {
      return {
        latitude: gw.latitude,
        longitude: gw.longitude,
        title: th.getEntityName(gw, "gatewayEUI"),
      };
    });
  }

  getFilteredGateways(): Gateway[] {
    if (this.search === "") {
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
