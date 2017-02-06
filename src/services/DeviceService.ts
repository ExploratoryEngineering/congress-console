import { Device } from 'Models/Device';
import { HttpClient } from 'aurelia-http-client';

import NetworkInformation from 'Helpers/NetworkInformation';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Device service');

export class DeviceService {
  static inject = [HttpClient];
  httpClient: HttpClient;

  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  fetchDevices(applicationEui: string): Promise<Device[]> {
    return this.httpClient.get(`/api/networks/${NetworkInformation.selectedNetwork}/applications/${applicationEui}/devices`)
      .then(data => data.content.devices)
      .then(devices => {
        Log.debug('Fetched devices', devices);
        return devices.map(Device.newFromDto);
      });
  }

  fetchDeviceByEUI(applicationEui: string, deviceEui: string): Promise<Device> {
    return this.httpClient.get(`/api/networks/${NetworkInformation.selectedNetwork}/applications/${applicationEui}/devices/${deviceEui}`)
      .then(device => {
        Log.debug('Fetched device ', device);
        return Device.newFromDto(device);
      });
  }

  createNewDevice(device: Device): Promise<Device> {
    Log.debug('ClientService: Creating client', device);
    return this.httpClient.post(
      `/api/networks/${NetworkInformation.selectedNetwork}/applications/${device.appEui}/devices`,
      Device.toDto(device)
    ).then(res => {
      Log.debug('Created device ', res);
      return Device.newFromDto(res);
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
