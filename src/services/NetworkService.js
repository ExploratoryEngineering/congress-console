import { Network } from '../models/Network';
import { HttpClient } from 'aurelia-http-client';

export class NetworkService {
  static inject = [HttpClient];

  // Debug only
  createdNetworks = [];

  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  fetchAllNetworks() {
    return this.httpClient.get('/api/networks')
      .then(data => data.content.networks)
      .then(networks => {
        return networks.map(network => new Network(network));
      })
      .then(networks => networks.concat(this.createdNetworks));
  }

  fetchNetworkByEui(networkEui) {
    return this.httpClient.get(`/api/networks/${networkEui}`)
      .then(network => {
        return new Network(network);
      });
  }

  createNewNetwork(network) {
    return new Promise((res) => {
      this.createdNetworks.push(network);
      res(network);
    });
  }

  updateNetwork(network) {
    return new Promise((res) => {
      console.log('Updating network', network);
      res(network);
    });
  }

  deleteNetwork(network) {
    return new Promise((res) => {
      console.log('Deleting network', network);
      res();
    });
  }
}
