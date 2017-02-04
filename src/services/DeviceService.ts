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
        return devices.map(device => new Device(this.mapFromServer(device)));
      });
  }

  fetchDeviceByEUI(applicationEui: string, deviceEui: string): Promise<Device> {
    return this.httpClient.get(`/api/networks/${NetworkInformation.selectedNetwork}/applications/${applicationEui}/devices/${deviceEui}`)
      .then(device => {
        Log.debug('Fetched device ', device);
        return new Device(this.mapFromServer(device));
      });
  }

  createNewDevice(device: Device): Promise<Device> {
    Log.debug('ClientService: Creating client', device);
    return this.httpClient.post(
      `/api/networks/${NetworkInformation.selectedNetwork}/applications/${device.appEui}/devices`,
      this.mapToServer(device)
    ).then(res => {
      Log.debug('Created device ', res);
      return new Device(this.mapFromServer(res));
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

  mapToServer(device) {
    return {
      DeviceEUI: device.deviceEUI,
      DevAddr: device.devAddr,
      AppSKey: device.appSKey,
      NwkSKey: device.nwkSKey,
      AppEUI: device.appEUI,
      State: device.state,
      FCntUp: device.fCntUp,
      FCntDn: device.fCntDn,
      RelaxedCounter: device.relaxedCounter,
      DevNonce: device.devNonce,
      DevNonceHistory: device.devNonceHistory
    };
  }

  mapFromServer(device) {
    return {
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
    };
  }
}
