import { AureliaConfiguration } from 'aurelia-configuration';
import { bindable, autoinject } from 'aurelia-framework';

import { LogBuilder } from 'Helpers/LogBuilder';
import { Websocket } from 'Helpers/Websocket';

const Log = LogBuilder.create('Event log');

@autoinject
export class EventLog {
  @bindable
  websocket: Websocket;
  @bindable
  eventLogStreamEndpoint: string = '';

  websocketData: any[] = [];

  constructor(
    private aureliaConfiguration: AureliaConfiguration
  ) { }

  websocketEndpointChanged() {
    this.websocket.close();
    this.initiateWebsocket();
  }

  initiateWebsocket() {
    Log.debug('Initiating websocket');
    this.websocketData.push('Connecting to endpoint');
    this.websocket = new Websocket({
      url: this.aureliaConfiguration.get('api.wsEndpoint') + this.eventLogStreamEndpoint,
      onmessage: (message) => { this.onMessage(message); },
      onopen: () => { this.websocketData.push('Connected to endpoint, awaiting data'); },
      onerror: () => { this.websocketData.push('There was an error connecting to the endpoint'); }
    });

  }

  onMessage(message: any) {
    Log.debug('Got message', message);
    this.websocketData.push(message.data);
  }

  bind() {
    this.initiateWebsocket();
  }

  unbind() {
    Log.debug('Unbind, closing websocket');
    this.websocket.close();
  }
}