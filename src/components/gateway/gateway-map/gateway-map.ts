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

const MARKERS = {
  MAP_PIN: "M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z",
};

const MARKER_COLORS = {
  PUBLIC_GATEWAY: "#007ace",
  PERSONAL_GATEWAY: "#f84315",
};

export class GatewayMap {
  @bindable publicGateways: Gateway[] = [];
  @bindable personalGateways: Gateway[] = [];

  showPublicGateways: boolean = false;
  showPersonalGateways: boolean = true;

  latitude = 63.422064;
  longitude = 10.438485;

  @computedFrom("publicGateways", "personalGateways", "showPublicGateways", "showPersonalGateways")
  get gatewayMarkers(): GatewayMapMarker[] {
    let publicGateways = this.showPublicGateways ? this.publicGateways.filter(this.isGatewayValid).map((gw) => {
      return {
        latitude: gw.latitude,
        longitude: gw.longitude,
        title: th.getEntityName(gw, "gatewayEUI"),
        icon: {
          path: MARKERS.MAP_PIN,
          fillColor: MARKER_COLORS.PUBLIC_GATEWAY,
          fillOpacity: 1,
          strokeColor: "rgba(0,0,0,.54)",
          strokeWeight: 1,
        },
      };
    }) : [];

    const personalGateways = this.showPersonalGateways ? this.personalGateways.filter(this.isGatewayValid).map((gw) => {
      return {
        latitude: gw.latitude,
        longitude: gw.longitude,
        title: th.getEntityName(gw, "gatewayEUI"),
        icon: {
          path: MARKERS.MAP_PIN,
          fillColor: MARKER_COLORS.PERSONAL_GATEWAY,
          fillOpacity: 1,
          strokeColor: "rgba(0,0,0,.54)",
          strokeWeight: 1,
        },
      };
    }) : [];

    personalGateways.forEach((personalGateway) => {
      publicGateways = publicGateways.filter((publicGateway) => {
        return this.isDuplicate(personalGateway, publicGateway);
      });
    });

    return personalGateways.concat(publicGateways);
  }

  private isGatewayValid(gateway: Gateway): boolean {
    return gateway.longitude !== 0 || gateway.latitude !== 0;
  }

  private isDuplicate(gwm1: GatewayMapMarker, gwm2: GatewayMapMarker): boolean {
    return (gwm1.latitude !== gwm2.latitude)
      && (gwm1.longitude !== gwm2.longitude);
  }
}
