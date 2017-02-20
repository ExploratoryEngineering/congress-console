import { LogBuilder } from 'Helpers/LogBuilder';
import Cookies from 'js-cookie';
import { NetworkService } from 'Services/NetworkService';
import { Network } from 'Models/Network';

const Log = LogBuilder.create('Network Information');

export class NetworkInformation {
  static inject = [NetworkService];

  availableNetworks: Network[] = [];
  selectedNetwork: Network;

  constructor(private networkService: NetworkService) {
    this.networkService = networkService;
  }

  fetchNetworks(): Promise<any> {
    let selectedNetworkEUI = Cookies.get('selectedNetworkEUI');

    return this.networkService.fetchAllNetworks().then((networks) => {
      this.availableNetworks = networks;

      Log.debug(selectedNetworkEUI, networks);

      if (selectedNetworkEUI) {
        let selectedNetwork = networks.find((network) => {
          return network.netEui === selectedNetworkEUI;
        });

        if (selectedNetwork) {
          this.selectedNetwork = selectedNetwork;
        } else {
          Log.warn('Tried to select an nonexisting network. Fallback to first network found');
          this.selectedNetwork = networks[0];
        }
      } else {
        this.selectedNetwork = networks[0];
      }
    });
  }
}
