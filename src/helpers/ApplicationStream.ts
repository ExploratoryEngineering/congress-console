import { autoinject } from 'aurelia-framework';
import { LogBuilder } from 'Helpers/LogBuilder';
import { AureliaConfiguration } from 'aurelia-configuration';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Websocket, WebsocketDeviceDataMessage, WebsocketStatusMessage, WebsocketMessage } from 'Helpers/Websocket';

const Log = LogBuilder.create('ApplicationStream');

/**
 * Simple class to abstract the websocket functionality from view models when
 * wanting a data stream based on application.
 */
@autoinject
export class ApplicationStream {
  websocket: Websocket | null;

  constructor(
    private eventAggregator: EventAggregator,
    private config: AureliaConfiguration
  ) { }

  onApplicationStreamMessage(message) {
    let wsMessage: WebsocketMessage = JSON.parse(message.data);

    if (wsMessage.type === 'KeepAlive') {
      let statusMessage: WebsocketStatusMessage = wsMessage;
    } else if (wsMessage.type === 'DeviceData') {
      let deviceMessage: WebsocketDeviceDataMessage = wsMessage;

      this.eventAggregator.publish('deviceData', deviceMessage.data);
    }
  }

  openApplicationDataStream(applicationEUI: string) {
    if (!this.websocket) {
      this.websocket = new Websocket({
        url: `${this.config.get('api.wsEndpoint')}/applications/${applicationEUI}/stream`,
        onerror: (err) => { Log.error('WS Error', err); },
        onopen: (msg) => { Log.debug('WS Open: ', msg); },
        onclose: (msg) => { Log.debug('WS Close: ', msg); },
        onmessage: (msg) => { this.onApplicationStreamMessage(msg); }
      });
    } else {
      this.websocket.reconnect();
    }
  }

  closeApplicationStream() {
    Log.debug('Closing WS');
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }
}
