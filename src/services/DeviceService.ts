import { autoinject } from 'aurelia-framework';

import { ApiClient } from 'Helpers/ApiClient';
import { Device } from 'Models/Device';

import { NetworkInformation } from 'Helpers/NetworkInformation';
import { LogBuilder } from 'Helpers/LogBuilder';

import * as moment from 'moment';

const Log = LogBuilder.create('Device service');

interface NewDevice {
}

export interface NewOTAADevice extends NewDevice { }

export interface NewABPDevice extends NewDevice {
  Type: string;
  DevAddr: string;
  AppSKey: string;
  NwkSKey: string;
}

@autoinject
export class DeviceService {
  constructor(
    private apiClient: ApiClient,
    private networkInformation: NetworkInformation
  ) { }

  fetchDevices(applicationEui: string): Promise<Device[]> {
    return this.apiClient.http.get(`/networks/${this.networkInformation.selectedNetwork.netEui}/applications/${applicationEui}/devices`)
      .then(data => data.content.devices)
      .then(devices => {
        Log.debug('Fetched devices', devices);
        return devices.map(Device.newFromDto);
      });
  }

  fetchDeviceByEUI(applicationEui: string, deviceEui: string): Promise<Device> {
    return this.apiClient.http.get(`/networks/${this.networkInformation.selectedNetwork.netEui}/applications/${applicationEui}/devices/${deviceEui}`)
      .then(data => data.content.devices)
      .then(device => {
        Log.debug('Fetched device ', device);
        return Device.newFromDto(device);
      });
  }

  createNewDevice(device: NewABPDevice | NewOTAADevice, appEui: string): Promise<Device> {
    Log.debug('Creating device', device);
    return this.apiClient.http.post(
      `/networks/${this.networkInformation.selectedNetwork.netEui}/applications/${appEui}/devices`,
      device
    ).then(data => data.content)
      .then(newDevice => {
        Log.debug('Created device ', newDevice);
        return Device.newFromDto(newDevice);
      });
  }

  updateDevice(device: Device): Promise<Device> {
    return new Promise((res) => {
      Log.debug('Updating device', device);
      res(device);
    });
  }

  deleteDevice(device: Device): Promise<any> {
    return new Promise((res) => {
      Log.debug('Deleting device', device);
      res();
    });
  }
}
