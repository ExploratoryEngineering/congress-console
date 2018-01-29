interface DeviceDto {
  appKey: string;
  appSKey: string;
  devAddr: string;
  deviceEUI: string;
  deviceType: string;
  fCntDn: number;
  fCntUp: number;
  nwkSKey: string;
  relaxedCounter: boolean;
  keyWarning: boolean;
  tags: { [tagName: string]: string };
}

export class Device implements TagEntity {
  static newFromDto(device: DeviceDto): Device {
    return new Device({
      deviceEUI: device.deviceEUI,
      devAddr: device.devAddr,
      appKey: device.appKey,
      appSKey: device.appSKey,
      nwkSKey: device.nwkSKey,
      deviceType: device.deviceType,
      fCntUp: device.fCntUp,
      fCntDn: device.fCntDn,
      relaxedCounter: device.relaxedCounter,
      keyWarning: device.keyWarning,
      tags: device.tags,
    });
  }

  static toDto(device: Device): DeviceDto {
    return {
      deviceEUI: device.deviceEUI,
      devAddr: device.devAddr,
      appKey: device.appKey,
      appSKey: device.appSKey,
      nwkSKey: device.nwkSKey,
      deviceType: device.deviceType,
      fCntUp: device.fCntUp,
      fCntDn: device.fCntDn,
      relaxedCounter: device.relaxedCounter,
      keyWarning: device.keyWarning,
      tags: device.tags,
    };
  }

  appKey: string;
  appSKey: string;
  devAddr: string;
  deviceEUI: string;
  deviceType: string;
  fCntUp: number;
  fCntDn: number;
  nwkSKey: string;
  relaxedCounter: boolean;
  keyWarning: boolean;
  tags: { [tagName: string]: string };

  constructor({
    deviceEUI = "",
    devAddr = "",
    appKey = "",
    appSKey = "",
    nwkSKey = "",
    deviceType = "ABP",
    fCntUp = 0,
    fCntDn = 0,
    relaxedCounter = true,
    keyWarning = false,
    tags = {},
  } = {}) {
    this.deviceEUI = deviceEUI;
    this.devAddr = devAddr;
    this.appKey = appKey;
    this.appSKey = appSKey;
    this.nwkSKey = nwkSKey;
    this.deviceType = deviceType;
    this.fCntUp = fCntUp;
    this.fCntDn = fCntDn;
    this.relaxedCounter = relaxedCounter;
    this.keyWarning = keyWarning;
    this.tags = tags;
  }
}
