import { Network } from '../models/Network';
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
        return networks.map(network => new Network(network));
      });
  }

  fetchNetworkByEui(networkEui: string): Promise<Network> {
    return this.httpClient.get(`/api/networks/${networkEui}`)
      .then(network => {
        return new Network(network);
      });
  }

  createNewNetwork(network: Network): Promise<Network> {
    return new Promise((res) => {
      res(network);
    });
  }

  updateNetwork(network: Network): Promise<Network> {
    return new Promise((res) => {
      Log.debug('Updating network', network);
      res(network);
    });
  }

  deleteNetwork(network: Network): Promise<any> {
    return new Promise((res) => {
      Log.debug('Deleting network', network);
      res();
    });
  }
}
