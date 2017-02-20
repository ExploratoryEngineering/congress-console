import { LogBuilder } from 'Helpers/LogBuilder';

const GUARD_DOG_INTERVAL: number = 5000;
const APP_WAKE_TIME: number = 10000;
const WS = WebSocket;
const Log = LogBuilder.create('Websocket');

export class Websocket {
  private socket: WebSocket;
  private lastGuardDogBark = 0;
  private guardDogIntervalId = 0;

  private config;

  constructor({
    url = '',
    onmessage = (message: WebsocketStatusMessage | WebsocketDeviceDataMessage) => { },
    onopen = (open: any) => { },
    onclose = (close: any) => { },
    onerror = (error: any) => { }
  } = {}) {
    this._connect({
      url: url,
      onmessage: onmessage,
      onopen: onopen,
      onclose: onclose,
      onerror: onerror
    });
  }

  _connect(config) {
    if (WS === undefined) {
      Log.info('WebSockets are not supported in this browser');
      return;
    }

    this.socket = new WS(config.url);
    this.socket.onmessage = config.onmessage;
    this.socket.onopen = config.onopen;
    this.socket.onclose = config.onclose;
    this.socket.onerror = config.onerror;

    this.config = config;

    if (!this.guardDogIntervalId) {
      this.initiateGuardDog();
    }
  }

  send(message) {
    if (!this.isOpen()) {
      Log.info('Tried sending to a closed socket: ', message);
      return;
    }

    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    }

    Log.info('Sending WebSocket message: ', message);
    this.socket.send(message);
  }

  isOpen() {
    return this.socket && this.socket.readyState === WS.OPEN;
  }

  initiateGuardDog() {
    this.lastGuardDogBark = (new Date()).getTime();

    this.guardDogIntervalId = window.setInterval(() => {
      const newBark = (new Date()).getTime();
      if (newBark - this.lastGuardDogBark > (GUARD_DOG_INTERVAL + GUARD_DOG_INTERVAL / 2)) {
        Log.info('Reconnect due to guard dog');
        setTimeout(() => {
          this.reconnect();
        }, APP_WAKE_TIME);
      }
      this.lastGuardDogBark = newBark;
    }, GUARD_DOG_INTERVAL);
  }

  close() {
    if (this.isOpen()) {
      this.socket.close();
    }
  }

  reconnect() {
    Log.info('Reconnecting websocket.');
    this.close();
    this._connect(this.config);
  }
}

type MessageType = 'SocketStatus' | 'DeviceData';

export interface WebsocketMessage {
  MessageType: MessageType;
  MessageBody: any;
}

export interface WebsocketStatusMessage extends WebsocketMessage {
  MessageBody: {
    KeepAlive: boolean
  };
}

export interface WebsocketDeviceDataMessage extends WebsocketMessage {
  MessageBody: MessageData;
}
