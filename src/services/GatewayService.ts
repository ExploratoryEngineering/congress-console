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

import { autoinject } from "aurelia-framework";
import { ApiClient } from "Helpers/ApiClient";
import { Gateway } from "Models/Gateway";

interface GatewayStats {
  messagesIn: number[];
  messagesOut: number[];
}

@autoinject
export class GatewayService {
  constructor(
    private apiClient: ApiClient,
  ) { }

  fetchPersonalGateways(): Promise<Gateway[]> {
    return this.apiClient.http.get("/gateways")
      .then((data) => data.content.gateways)
      .then((gateways) => gateways.map(Gateway.newFromDto));
  }

  fetchPublicGateways(): Promise<Gateway[]> {
    return this.apiClient.http.get("/gateways/public")
      .then((data) => data.content.gateways)
      .then((gateways) => gateways.map(Gateway.newFromDto));
  }

  fetchGatewayStatsByEUI(gatewayEui: string): Promise<GatewayStats> {
    return this.apiClient.http.get(`/gateways/${gatewayEui}/stats`)
      .then((data) => JSON.parse(data.content));
  }

  createNewGateway(gateway: Gateway): Promise<Gateway> {
    return this.apiClient.http.post(
      "/gateways",
      Gateway.toDto(gateway),
    ).then((data) => data.content)
      .then((res) => {
        return Gateway.newFromDto(res);
      });
  }

  editGateway(gateway: Gateway): Promise<Gateway> {
    return this.apiClient.http.put(
      `/gateways/${gateway.gatewayEUI}`,
      Gateway.toDto(gateway),
    ).then((data) => data.content)
      .then((res) => {
        return Gateway.newFromDto(res);
      });
  }

  deleteGateway(gateway: Gateway) {
    return this.apiClient.http.delete(
      `/gateways/${gateway.gatewayEUI}`,
    );
  }
}
