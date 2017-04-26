import { autoinject } from 'aurelia-framework';
import { LogBuilder } from 'Helpers/LogBuilder';
import Cookies from 'js-cookie';
import { NetworkService } from 'Services/NetworkService';
import { Network } from 'Models/Network';

const Log = LogBuilder.create('Network Information');

@autoinject
export class NetworkInformation {
  availableNetworks: Network[] = [];
  selectedNetwork: Network;

  constructor(
    private networkService: NetworkService
  ) { }

  async fetchSelectedNetwork(): Promise<Network> {
    if (this.selectedNetwork) {
      return Promise.resolve(this.selectedNetwork);
    } else {
      await this.fetchNetworksAndSelectNetwork();
      return Promise.resolve(this.selectedNetwork);
    }
  }

  fetchNetworksAndSelectNetwork(): Promise<any> {
    let selectedNetworkEUI = Cookies.get('selectedNetworkEUI');

    return this.networkService.fetchAllNetworks().then((networks) => {
      this.availableNetworks = networks;

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
