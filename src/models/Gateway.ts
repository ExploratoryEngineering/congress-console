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

  constructor(
    altitude = Debug.getRandomNumber(100),
    gatewayEUI = Debug.getRandomHexString(3, false),
    ip = '127.0.0.1',
    latitude = Debug.getRandomNumber(),
    longitude = Debug.getRandomNumber(),
    strictip = false
  ) {
    this.altitude = altitude;
    this.gatewayEUI = gatewayEUI;
    this.ip = ip;
    this.latitude = latitude;
    this.longitude = longitude;
    this.strictip = strictip;
  }

  static newFromDto(device: GatewayDto): Gateway {
    return new Gateway();
  }

  static toDto(gateway: Gateway): GatewayDto {
    return {
      Altitude: gateway.altitude,
      GatewayEUI: gateway.gatewayEUI,
      IP: gateway.ip,
      Latitude: gateway.latitude,
      Longitude: gateway.longitude,
      StrictIP: gateway.strictip
    };
  }
}
