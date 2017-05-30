import { Time } from 'Helpers/Time';
import { autoinject } from 'aurelia-framework';

import { ApiClient } from 'Helpers/ApiClient';
import { Device } from 'Models/Device';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Device service');

interface NewDevice {
  DeviceType: string;
  Tags: { [tagName: string]: string };
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
  ) { }

  fetchDevices(applicationEui: string): Promise<Device[]> {
    return this.apiClient.http.get(`/applications/${applicationEui}/devices`)
      .then(data => data.content.devices)
      .then(devices => {
        Log.debug('Fetched devices', devices);
        return devices.map(Device.newFromDto);
      });
  }

  fetchDeviceByEUI(applicationEui: string, deviceEui: string): Promise<Device> {
    return this.apiClient.http.get(`/applications/${applicationEui}/devices/${deviceEui}`)
      .then(data => data.content.devices)
      .then(device => {
        Log.debug('Fetched device ', device);
        return Device.newFromDto(device);
      });
  }

  fetchSourceForDevice(applicationEui: string, deviceEui: string): Promise<string> {
    return this.apiClient.http
      .createRequest(`/applications/${applicationEui}/devices/${deviceEui}/source`)
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
      `/applications/${applicationEui}/devices/${deviceEui}/data?limit=${limit}&since=${since}`
    )
      .then(data => data.content.Messages)
      .then(data => data.reverse());

  }

  async createNewDevice(device: NewABPDevice | NewOTAADevice, appEui: string): Promise<Device> {
    Log.debug('Creating device', device);
    return this.apiClient.http.post(
      `/applications/${appEui}/devices`,
      device
    ).then(data => data.content)
      .then(newDevice => {
        Log.debug('Created device ', newDevice);
        return Device.newFromDto(newDevice);
      });
  }

  async updateDevice(device: Device): Promise<Device> {
    Log.debug('Updating device', device);
    return Promise.resolve(device);
  }

  /**
   * Deletes given device under given application EUI
   * @param appEUI The application EUI for which the device resides
   * @param device The device object to be deleted
   */
  async deleteDevice(appEUI: string, device: Device): Promise<any> {
    return this.apiClient.http.delete(
      `/applications/${appEUI}/devices/${device.deviceEUI}`
    ).then(res => {
      Log.debug('Delete success!', res);
    });
  }
}
