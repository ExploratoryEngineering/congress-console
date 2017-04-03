import { Gateway } from 'Models/Gateway';
import { ApiClient } from 'Helpers/ApiClient';
import { autoinject } from 'aurelia-framework';

@autoinject
export class GatewayService {
  constructor(
    private apiClient: ApiClient
  ) { }

  getGateways(): Promise<Gateway[]> {
    return this.apiClient.http.get('/gateways')
      .then(data => data.content.gateways);
  }

  createGateWay(gateway: Gateway): Promise<Gateway> {
    return this.apiClient.http.post(
      '/gateways',
      Gateway.toDto(gateway)
    ).then(data => data.content)
      .then(res => {
        return Gateway.newFromDto(res);
      });
  }
}
