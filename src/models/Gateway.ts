import Debug from 'Helpers/Debug';

interface GatewayDto {
  Altitude: number;
  GatewayEUI: string;
  IP: string;
  Latitude: number;
  Longitude: number;
  StrictIP: boolean;
  Tags: { [tagName: string]: string };
}

export class Gateway implements TagEntity {
  altitude: number;
  gatewayEUI: string;
  ip: string;
  latitude: number;
  longitude: number;
  strictip: boolean;
  tags: { [tagName: string]: string };

  constructor({
    altitude = 0,
    gatewayEUI = '',
    ip = '',
    latitude = 0,
    longitude = 0,
    strictip = true,
    tags = {}
  } = {}) {
    this.altitude = altitude;
    this.gatewayEUI = gatewayEUI;
    this.ip = ip;
    this.latitude = latitude;
    this.longitude = longitude;
    this.strictip = strictip;
    this.tags = tags;
  }

  static newFromDto(gw: GatewayDto): Gateway {
    return new Gateway({
      altitude: gw.Altitude,
      latitude: gw.Latitude,
      longitude: gw.Longitude,
      ip: gw.IP,
      strictip: gw.StrictIP,
      gatewayEUI: gw.GatewayEUI,
      tags: gw.Tags
    });
  }

  static toDto(gateway: Gateway): GatewayDto {
    return {
      Altitude: gateway.altitude,
      GatewayEUI: gateway.gatewayEUI,
      IP: gateway.ip,
      Latitude: parseFloat(String(gateway.latitude)),
      Longitude: parseFloat(String(gateway.longitude)),
      StrictIP: gateway.strictip,
      Tags: gateway.tags
    };
  }
}
