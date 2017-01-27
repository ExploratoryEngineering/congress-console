import { LogBuilder } from 'Helpers/LogBuilder';

const GUARD_DOG_INTERVAL = 5000;
const APP_WAKE_TIME = 10000;
const WS = window.WebSocket;
const Log = LogBuilder.create('Websocket');

export class Websocket {
  socket = null;
  lastGuardDogBark = 0;
  guardDogIntervalId = 0;

  constructor({
    url = '',
    onmessage = () => {},
    onopen = () => {},
    onclose = () => {},
    onerror = () => {}
  } = config) {
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
    this.guardDogIntervalId = setInterval(() => {
      const newBark = (new Date()).getTime();
      if (newBark - this.lastGuardDogBark > (GUARD_DOG_INTERVAL + GUARD_DOG_INTERVAL / 2)) {
        Log.info('GUARDDOG: BARK TOO LATE, RECONNECT');
        setTimeout(function() {
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
  }
}
