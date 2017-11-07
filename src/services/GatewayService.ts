import { autoinject } from "aurelia-framework";
import { ApiClient } from "Helpers/ApiClient";
import { Gateway } from "Models/Gateway";

@autoinject
export class GatewayService {
  constructor(
    private apiClient: ApiClient,
  ) { }

  fetchGateways(): Promise<Gateway[]> {
    return this.apiClient.http.get("/gateways")
      .then((data) => data.content.gateways)
      .then((gateways) => gateways.map(Gateway.newFromDto));
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
