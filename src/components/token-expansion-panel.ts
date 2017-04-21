import { NetworkInformation } from 'Helpers/NetworkInformation';
import { AureliaConfiguration } from 'aurelia-configuration';
import { bindable, autoinject, containerless } from 'aurelia-framework';
import { LogBuilder } from 'Helpers/LogBuilder';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Token } from 'Models/Token';

const Log = LogBuilder.create('Token expansion panel');

@autoinject
@containerless
export class TokenExpansionPanel {
  @bindable
  token: Token;
  @bindable
  active: boolean = false;

  constructor(
    private eventAggregator: EventAggregator,
    private networkInformation: NetworkInformation,
    private config: AureliaConfiguration
  ) { }

  toggle() {
    this.active = !this.active;
  }

  curlGetDevices() {
    return `curl
    -XGET ${this.config.get('api.endpoint')}${this.token.resource}/devices
    -HX-API-Token:${this.token.token}`;
  }

  curlGetApplicationData() {
    return `curl 
    -XGET ${this.config.get('api.endpoint')}${this.token.resource}/data
    -HX-API-Token:${this.token.token}
    `;
  }

  deleteToken() {
    Log.debug('User wants to delete token', this.token);
    this.eventAggregator.publish('token:delete', this.token);
  }
}
