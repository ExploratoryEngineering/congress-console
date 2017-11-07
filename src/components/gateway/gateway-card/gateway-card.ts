import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, bindable, containerless } from "aurelia-framework";
import { LogBuilder } from "Helpers/LogBuilder";
import { Gateway } from "Models/Gateway";

import Debug from "Helpers/Debug";

const Log = LogBuilder.create("Gateway-card");

@containerless
@autoinject
export class GatewayCard {
  @bindable gateway: Gateway;

  constructor(
    private eventAggregator: EventAggregator,
  ) { }

  editGateway() {
    this.eventAggregator.publish("gateway:edit", this.gateway);
  }

  deleteGateway() {
    this.eventAggregator.publish("gateway:delete", this.gateway);
  }

  showEventLog() {
    this.eventAggregator.publish("gateway:eventLog", this.gateway);
  }
}
