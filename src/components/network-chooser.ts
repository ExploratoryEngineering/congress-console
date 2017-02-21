import Cookies from 'js-cookie';
import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Network } from 'Models/Network';
import { NetworkInformation } from 'Helpers/NetworkInformation';

@autoinject
export class NetworkChooser {
  constructor(
    private networkInformation: NetworkInformation,
    private eventAggregator: EventAggregator
  ) { }

  selectNetwork(network: Network) {
    this.networkInformation.selectedNetwork = network;
    Cookies.set('selectedNetworkEUI', network.netEui);
    this.eventAggregator.publish('network:selected', network);
  }
}
