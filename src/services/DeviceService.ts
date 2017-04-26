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
  DeviceType: string;
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

  async fetchDevices(applicationEui: string): Promise<Device[]> {
    const { netEui } = await this.networkInformation.fetchSelectedNetwork();

    return this.apiClient.http.get(`/networks/${netEui}/applications/${applicationEui}/devices`)
      .then(data => data.content.devices)
      .then(devices => {
        Log.debug('Fetched devices', devices);
        return devices.map(Device.newFromDto);
      });
  }

  async fetchDeviceByEUI(applicationEui: string, deviceEui: string): Promise<Device> {
    const { netEui } = await this.networkInformation.fetchSelectedNetwork();

    return this.apiClient.http.get(`/networks/${netEui}/applications/${applicationEui}/devices/${deviceEui}`)
      .then(data => data.content.devices)
      .then(device => {
        Log.debug('Fetched device ', device);
        return Device.newFromDto(device);
      });
  }

  async fetchSourceForDevice(applicationEui: string, deviceEui: string): Promise<string> {
    const { netEui } = await this.networkInformation.fetchSelectedNetwork();

    return this.apiClient.http
      .createRequest(`/networks/${netEui}/applications/${applicationEui}/devices/${deviceEui}/source`)
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
  async fetchDeviceDataByEUI(
    applicationEui: string,
    deviceEui: string,
    {
      limit = 50,
      since = Time.SIX_HOURS_AGO.format('X')
    }: DataSearchParameters = {}): Promise<MessageData[]> {
    const { netEui } = await this.networkInformation.fetchSelectedNetwork();

    return this.apiClient.http.get(
      `/networks/${netEui}/applications/${applicationEui}/devices/${deviceEui}/data?limit=${limit}&since=${since}`
    )
      .then(data => data.content.Messages)
      .then(data => data.reverse());

  }

  async createNewDevice(device: NewABPDevice | NewOTAADevice, appEui: string): Promise<Device> {
    Log.debug('Creating device', device);
    const { netEui } = await this.networkInformation.fetchSelectedNetwork();

    return this.apiClient.http.post(
      `/networks/${netEui}/applications/${appEui}/devices`,
      device
    ).then(data => data.content)
      .then(newDevice => {
        Log.debug('Created device ', newDevice);
        return Device.newFromDto(newDevice);
      });
  }

  async updateDevice(device: Device): Promise<Device> {
    const { netEui } = await this.networkInformation.fetchSelectedNetwork();

    Log.debug('Updating device', device);
    return Promise.resolve(device);
  }

  /**
   * Deletes given device under given application EUI
   * @param appEUI The application EUI for which the device resides
   * @param device The device object to be deleted
   */
  async deleteDevice(appEUI: string, device: Device): Promise<any> {
    const { netEui } = await this.networkInformation.fetchSelectedNetwork();

    return this.apiClient.http.delete(
      `/networks/${netEui}/applications/${appEUI}/devices/${device.deviceEUI}`
    ).then(res => {
      Log.debug('Delete success!', res);
    });
  }
}
