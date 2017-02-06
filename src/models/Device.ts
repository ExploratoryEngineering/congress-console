import Debug from 'Helpers/Debug';

export class Device {
  deviceEUI: string;
  devAddr: string;
  appSKey: string;
  nwkSKey: string;
  appEui: string;
  state: string;
  fCntUp: number;
  fCntDn: number;
  relaxedCounter: boolean;
  devNonce: number;
  devNonceHistory: any;

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

  static newFromDto(device): Device {
    return new Device({
      deviceEUI: device.DeviceEUI,
      devAddr: device.DevAddr,
      appSKey: device.AppSKey,
      nwkSKey: device.NwkSKey,
      appEUI: device.AppEUI,
      state: device.State,
      fCntUp: device.FCntUp,
      fCntDn: device.FCntDn,
      relaxedCounter: device.RelaxedCounter,
      devNonce: device.DevNonce,
      devNonceHistory: device.DevNonceHistory
    });
  }

  static toDto(device: Device) {
    return {
      DeviceEUI: device.deviceEUI,
      DevAddr: device.devAddr,
      AppSKey: device.appSKey,
      NwkSKey: device.nwkSKey,
      AppEUI: device.appEui,
      State: device.state,
      FCntUp: device.fCntUp,
      FCntDn: device.fCntDn,
      RelaxedCounter: device.relaxedCounter,
      DevNonce: device.devNonce,
      DevNonceHistory: device.devNonceHistory
    };
  }
}
