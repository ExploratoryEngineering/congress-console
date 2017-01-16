import Debug from 'Helpers/Debug';

export class Device {
  constructor({
    deviceEUI = Debug.getRandomHexString(),
    devAddr = Debug.getRandomHexString(3, false),
    appSKey = Debug.getRandomHexString(16, false),
    nwkSKey = Debug.getRandomHexString(16, false),
    appEUI = '',
    state = 'ABP',
    fCntUp = 0,
    fCntDn = 0,
    relaxedCounter = true,
    devNonce = 0,
    devNonceHistory = null
  } = {}) {
    this.deviceEUI = deviceEUI;
    this.devAddr = devAddr;
    this.appSKey = appSKey;
    this.nwkSKey = nwkSKey;
    this.appEui = appEUI;
    this.state = state;
    this.fCntUp = fCntUp;
    this.fCntDn = fCntDn;
    this.relaxedCounter = relaxedCounter;
    this.devNonce = devNonce;
    this.devNonceHistory = devNonceHistory;
  }
}
