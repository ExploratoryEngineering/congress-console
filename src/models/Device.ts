interface DeviceDto {
  AppSKey: string;
  DevAddr: string;
  DeviceEUI: string;
  DeviceType: string;
  FCntDn: number;
  FCntUp: number;
  NwkSKey: string;
  RelaxedCounter: boolean;
}

export class Device {
  appSKey: string;
  devAddr: string;
  deviceEUI: string;
  deviceType: string;
  fCntUp: number;
  fCntDn: number;
  nwkSKey: string;
  relaxedCounter: boolean;

  constructor({
    deviceEUI = '',
    devAddr = '',
    appSKey = '',
    nwkSKey = '',
    deviceType = 'ABP',
    fCntUp = 0,
    fCntDn = 0,
    relaxedCounter = true,
  } = {}) {
    this.deviceEUI = deviceEUI;
    this.devAddr = devAddr;
    this.appSKey = appSKey;
    this.nwkSKey = nwkSKey;
    this.deviceType = deviceType;
    this.fCntUp = fCntUp;
    this.fCntDn = fCntDn;
    this.relaxedCounter = relaxedCounter;
  }

  static newFromDto(device: DeviceDto): Device {
    return new Device({
      deviceEUI: device.DeviceEUI,
      devAddr: device.DevAddr,
      appSKey: device.AppSKey,
      nwkSKey: device.NwkSKey,
      deviceType: device.DeviceType,
      fCntUp: device.FCntUp,
      fCntDn: device.FCntDn,
      relaxedCounter: device.RelaxedCounter
    });
  }

  static toDto(device: Device): DeviceDto {
    return {
      DeviceEUI: device.deviceEUI,
      DevAddr: device.devAddr,
      AppSKey: device.appSKey,
      NwkSKey: device.nwkSKey,
      DeviceType: device.deviceType,
      FCntUp: device.fCntUp,
      FCntDn: device.fCntDn,
      RelaxedCounter: device.relaxedCounter
    };
  }
}
