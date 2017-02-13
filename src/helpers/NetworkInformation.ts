import Cookies from 'js-cookie';
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
    let selectedNetworkEU = Cookies.get('selectedNetworkEUI');

    return this.networkService.fetchAllNetworks().then((networks) => {
      this.availableNetworks = networks;

      if (selectedNetworkEU) {
        let selectedNetwork = networks.find((network) => {
          return network.netEui === selectedNetworkEU;
        });

        if (selectedNetwork) {
          this.selectedNetwork = selectedNetwork;
        }
      } else {
        this.selectedNetwork = networks[0];
      }
    });
  }
}
