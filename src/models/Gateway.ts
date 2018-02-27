/*
	Copyright 2018 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

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
  static newFromDto(gw: GatewayDto): Gateway {
    return new Gateway({
      altitude: gw.altitude,
      latitude: gw.latitude,
      longitude: gw.longitude,
      ip: gw.ip,
      strictip: gw.strictIP,
      gatewayEUI: gw.gatewayEUI,
      tags: gw.tags,
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
      tags: gateway.tags,
    };
  }

  altitude: number;
  gatewayEUI: string;
  ip: string;
  latitude: number;
  longitude: number;
  strictip: boolean;
  tags: { [tagName: string]: string };

  constructor({
    altitude = 0,
    gatewayEUI = "",
    ip = "",
    latitude = 0,
    longitude = 0,
    strictip = true,
    tags = {},
  } = {}) {
    this.altitude = altitude;
    this.gatewayEUI = gatewayEUI;
    this.ip = ip;
    this.latitude = latitude;
    this.longitude = longitude;
    this.strictip = strictip;
    this.tags = tags;
  }
}
