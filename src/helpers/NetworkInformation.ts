import { NetworkService } from 'Services/NetworkService';
import { Network } from 'Models/Network';

export class NetworkInformation {
  static inject = [NetworkService];

  availableNetworks: Network[] = [];
  selectedNetwork: Network;

  constructor(private networkService: NetworkService) {
    this.networkService = networkService;
  }

  fetchNetworks(): Promise<any> {
    return this.networkService.fetchAllNetworks().then((networks) => {
      this.availableNetworks = networks;
      this.selectedNetwork = networks[0];
    });
  }
}
