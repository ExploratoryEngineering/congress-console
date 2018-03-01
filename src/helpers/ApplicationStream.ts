/*
	Copyright 2018 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject } from "aurelia-framework";
import { LogBuilder } from "Helpers/LogBuilder";
import { Websocket, WebsocketDeviceDataMessage, WebsocketMessage, WebsocketStatusMessage } from "Helpers/Websocket";

const Log = LogBuilder.create("ApplicationStream");

/**
 * Simple class to abstract the websocket functionality from view models when
 * wanting a data stream based on application.
 */
@autoinject
export class ApplicationStream {
  websocket: Websocket | null;

  constructor(
    private eventAggregator: EventAggregator,
  ) { }

  onApplicationStreamMessage(message) {
    const wsMessage: WebsocketMessage = JSON.parse(message.data);

    if (wsMessage.type === "KeepAlive") {
      const statusMessage: WebsocketStatusMessage = wsMessage;
    } else if (wsMessage.type === "DeviceData") {
      const deviceMessage: WebsocketDeviceDataMessage = wsMessage;

      this.eventAggregator.publish("deviceData", deviceMessage.data);
    }
  }

  openApplicationDataStream(applicationEUI: string) {
    if (!this.websocket) {
      this.websocket = new Websocket({
        url: `${CONGRESS_WS_ENDPOINT}/applications/${applicationEUI}/stream`,
        onerror: (err) => { Log.error("WS Error", err); },
        onopen: (msg) => { Log.debug("WS Open: ", msg); },
        onclose: (msg) => { Log.debug("WS Close: ", msg); },
        onmessage: (msg) => { this.onApplicationStreamMessage(msg); },
      });
    } else {
      this.websocket.reconnect();
    }
  }

  closeApplicationStream() {
    Log.debug("Closing WS");
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }
}
