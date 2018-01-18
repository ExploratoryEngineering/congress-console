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
