import { Time } from 'Helpers/Time';
import { autoinject } from 'aurelia-framework';

import { ApiClient } from 'Helpers/ApiClient';
import { Device } from 'Models/Device';

import { NetworkInformation } from 'Helpers/NetworkInformation';
import { LogBuilder } from 'Helpers/LogBuilder';

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

  fetchSourceForDevice(applicationEui: string, deviceEui: string): Promise<string> {
    return this.apiClient.http
      .createRequest(`/networks/${this.networkInformation.selectedNetwork.netEui}/applications/${applicationEui}/devices/${deviceEui}/source`)
      .asGet()
      .withResponseType('text')
      .send().then(data => data.response);
  }

  /**
   * Fetches device data
   * @param {string} applicationEui Application EUI for the Device
   * @param {string} deviceEui Device EUI for the Device
   * @param {DataSearchParameters} searchParams Search parameters for getting data
   */
  fetchDeviceDataByEUI(
    applicationEui: string,
    deviceEui: string,
    {
      limit = 50,
      since = Time.SIX_HOURS_AGO.format('X')
    }: DataSearchParameters = {}): Promise<MessageData[]> {
    return this.apiClient.http.get(
      `/networks/${this.networkInformation.selectedNetwork.netEui}/applications/${applicationEui}/devices/${deviceEui}/data?limit=${limit}&since=${since}`
    )
      .then(data => data.content.Messages)
      .then(data => data.reverse());

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
