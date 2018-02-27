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
