import { Network } from 'Models/Network';
import { HttpClient } from 'aurelia-http-client';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Network service');

export class NetworkService {
  static inject = [HttpClient];
  httpClient: HttpClient;

  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  fetchAllNetworks(): Promise<Network[]> {
    return this.httpClient.get('/api/networks')
      .then(data => data.content.networks)
      .then(networks => {
        return networks.map(network => Network.newFromDto(network));
      });
  }

  fetchNetworkByEui(networkEui: string): Promise<Network> {
    return this.httpClient.get(`/api/networks/${networkEui}`)
      .then(data => data.content.networks)
      .then(network => Network.newFromDto(network));
  }
}
