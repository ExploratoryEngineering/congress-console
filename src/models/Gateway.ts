import Debug from 'Helpers/Debug';

interface GatewayDto {
  Altitude: number;
  GatewayEUI: string;
  IP: string;
  Latitude: number;
  Longitude: number;
  StrictIP: boolean;
}

export class Gateway {
  altitude: number;
  gatewayEUI: string;
  ip: string;
  latitude: number;
  longitude: number;
  strictip: boolean;

  constructor({
    altitude = 0,
    gatewayEUI = '',
    ip = '',
    latitude = 0,
    longitude = 0,
    strictip = true
  } = {}) {
    this.altitude = altitude;
    this.gatewayEUI = gatewayEUI;
    this.ip = ip;
    this.latitude = latitude;
    this.longitude = longitude;
    this.strictip = strictip;
  }

  static newFromDto(gw: GatewayDto): Gateway {
    return new Gateway({
      altitude: gw.Altitude,
      latitude: gw.Latitude,
      longitude: gw.Longitude,
      ip: gw.IP,
      strictip: gw.StrictIP,
      gatewayEUI: gw.GatewayEUI
    });
  }

  static toDto(gateway: Gateway): GatewayDto {
    return {
      Altitude: gateway.altitude,
      GatewayEUI: gateway.gatewayEUI,
      IP: gateway.ip,
      Latitude: parseFloat(String(gateway.latitude)),
      Longitude: parseFloat(String(gateway.longitude)),
      StrictIP: gateway.strictip
    };
  }
}
