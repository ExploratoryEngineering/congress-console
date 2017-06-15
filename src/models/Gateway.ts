import Debug from 'Helpers/Debug';

interface GatewayDto {
  altitude: number;
  gatewayEUI: string;
  ip: string;
  latitude: number;
  longitude: number;
  strictIP: boolean;
  tags: { [tagName: string]: string };
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
      altitude: gw.altitude,
      latitude: gw.latitude,
      longitude: gw.longitude,
      ip: gw.ip,
      strictip: gw.strictIP,
      gatewayEUI: gw.gatewayEUI,
      tags: gw.tags
    });
  }

  static toDto(gateway: Gateway): GatewayDto {
    return {
      altitude: gateway.altitude,
      gatewayEUI: gateway.gatewayEUI,
      ip: gateway.ip,
      latitude: parseFloat(String(gateway.latitude)),
      longitude: parseFloat(String(gateway.longitude)),
      strictIP: gateway.strictip,
      tags: gateway.tags
    };
  }
}
