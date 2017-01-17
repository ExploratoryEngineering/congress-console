import { Device } from 'Models/Device';
import { HttpClient } from 'aurelia-http-client';

import NetworkInformation from 'Helpers/NetworkInformation';

export class DeviceService {
  static inject = [HttpClient];

  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  fetchDevices(applicationEui) {
    return this.httpClient.get(`/api/networks/${NetworkInformation.selectedNetwork}/applications/${applicationEui}/devices`)
      .then(data => data.content.devices)
      .then(devices => {
        console.log('Fetched devices', devices);
        return devices.map(device => new Device(this.mapFromServer(device)));
      });
  }

  fetchDeviceByEUI(applicationEui, deviceEui) {
    return this.httpClient.get(`/api/networks/${NetworkInformation.selectedNetwork}/applications/${applicationEui}/devices/${deviceEui}`)
      .then(device => {
        console.log('Fetched device ', device);
        return new Client(device);
      });
  }

  createNewDevice(device) {
    console.log('ClientService: Creating client', device);
    return this.httpClient.post(
      `/api/networks/${NetworkInformation.selectedNetwork}/applications/${device.appEUI}/devices`,
      this.mapToServer(device)
      ).then(res => {
        console.log('Created device ', res);
      });
  }

  updateDevice(device) {
    return new Promise((res) => {
      console.log('Updating device', device);
      res(device);
    });
  }

  deleteDevice(device) {
    return new Promise((res) => {
      console.log('Deleting device', device);
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
