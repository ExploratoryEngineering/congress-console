import { EventAggregator } from 'aurelia-event-aggregator';
import { Network } from 'Models/Network';
import { NetworkInformation } from 'Helpers/NetworkInformation';


export class NetworkChooser {
  static inject = [NetworkInformation, EventAggregator];

  constructor(private networkInformation: NetworkInformation, private eventAggregator: EventAggregator) {
    this.networkInformation = networkInformation;
    this.eventAggregator = eventAggregator;
  }

  selectNetwork(network: Network) {
    this.networkInformation.selectedNetwork = network;
    this.eventAggregator.publish('network:selected', network);
  }
}
