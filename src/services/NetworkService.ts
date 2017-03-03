import { autoinject } from 'aurelia-framework';

import { ApiClient } from 'Helpers/ApiClient';
import { Network } from 'Models/Network';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Network service');

@autoinject
export class NetworkService {
  constructor(
    private apiClient: ApiClient
  ) { }

  fetchAllNetworks(): Promise<Network[]> {
    Log.debug('Fetching all networks');
    return this.apiClient.http.get('/networks')
      .then(data => {
        return data.content.networks;
      })
      .then(networks => {
        return networks.map(network => Network.newFromDto(network));
      });
  }

  fetchNetworkByEui(networkEui: string): Promise<Network> {
    return this.apiClient.http.get(`/api/networks/${networkEui}`)
      .then(data => data.content.networks)
      .then(network => Network.newFromDto(network));
  }
}
