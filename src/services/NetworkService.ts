import { ResponseHandler } from 'Helpers/ResponseHandler';
import { autoinject } from 'aurelia-framework';
import { Network } from 'Models/Network';
import { HttpClient } from 'aurelia-http-client';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Network service');

@autoinject
export class NetworkService {
  constructor(
    private httpClient: HttpClient,
    private responseHandler: ResponseHandler
  ) {
    this.httpClient.configure((client) => {
      client.withInterceptor({
        responseError: (responseError) => {
          this.responseHandler.handleResponse(responseError);
          return responseError;
        }
      });
    });
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
