import { autoinject } from "aurelia-framework";
import { Time } from "Helpers/Time";

import { ApiClient } from "Helpers/ApiClient";
import { Device } from "Models/Device";

import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("Device service");

interface NewDevice {
  DeviceType: string;
  RelaxedCounter: boolean;
  Tags: { [tagName: string]: string };
}

export interface NewOTAADevice extends NewDevice {
  DeviceType: "OTAA";
}

export interface NewABPDevice extends NewDevice {
  DeviceType: "ABP";
  DevAddr: string;
  AppSKey: string;
  NwkSKey: string;
}

export interface NewMessageData {
  data: string;
  port: number;
  ack?: boolean;
}

@autoinject
export class DeviceService {

  constructor(
    private apiClient: ApiClient,
  ) { }

  fetchDevices(applicationEui: string): Promise<Device[]> {
    return this.apiClient.http.get(`/applications/${applicationEui}/devices`)
      .then((data) => data.content.devices)
      .then((devices) => {
        return devices.map(Device.newFromDto);
      });
  }

  fetchDeviceByEUI(applicationEui: string, deviceEui: string): Promise<Device> {
    return this.apiClient.http.get(`/applications/${applicationEui}/devices/${deviceEui}`)
      .then((data) => data.content)
      .then((device) => {
        Log.debug("Fetched device ", device);
        return Device.newFromDto(device);
      });
  }

  fetchSourceForDevice(applicationEui: string, deviceEui: string, type: "lopy" | "c" = "c"): Promise<string> {
    return this.apiClient.http
      .createRequest(`/applications/${applicationEui}/devices/${deviceEui}/source?type=${type}`)
      .asGet()
      .withResponseType("text")
      .send().then((data) => data.response);
  }

  getTagsForDevice(applicationEui: string, deviceEui: string): Promise<TagObject> {
    return this.apiClient.http.get(`/applications/${applicationEui}/devices/${deviceEui}/tags`)
      .then((data) => data.content);
  }

  addTagToDevice(applicationEui: string, deviceEui: string, tag: Tag): Promise<TagObject> {
    const tagObject = {};
    tagObject[tag.key] = tag.value;

    return this.apiClient.http.post(`/applications/${applicationEui}/devices/${deviceEui}/tags`, tagObject)
      .then((data) => data.content);
  }

  deleteTagFromDevice(applicationEui: string, deviceEui: string, tag: Tag): Promise<any> {
    return this.apiClient.http.delete(`/applications/${applicationEui}/devices/${deviceEui}/tags/${tag.key}`);
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
      since = Time.SIX_HOURS_AGO.format("x"),
    }: DataSearchParameters = {}): Promise<MessageData[]> {
    return this.apiClient.http.get(
      `/applications/${applicationEui}/devices/${deviceEui}/data?limit=${limit}&since=${since}`,
    )
      .then((data) => data.content.messages)
      .then((messages: MessageData[]) => {
        return messages.sort((a, b) => {
          return b.timestamp - a.timestamp;
        });
      });
  }

  async sendMessageToDevice(applicationEui: string, deviceEui: string, messageData: NewMessageData): Promise<NewMessageData> {
    return this.apiClient.http.post(
      `/applications/${applicationEui}/devices/${deviceEui}/message`,
      messageData,
    ).then((data) => data.content);
  }

  async createNewDevice(device: NewABPDevice | NewOTAADevice, appEui: string): Promise<Device> {
    Log.debug("Creating device", device);
    return this.apiClient.http.post(
      `/applications/${appEui}/devices`,
      device,
    ).then((data) => data.content)
      .then((newDevice) => {
        Log.debug("Created device ", newDevice);
        return Device.newFromDto(newDevice);
      });
  }

  async updateDevice(applicationEui: string, device: Device): Promise<Device> {
    Log.debug("Updating device", device);
    return this.apiClient.http.put(
      `/applications/${applicationEui}/devices/${device.deviceEUI}`,
      Device.toDto(device),
    ).then((data) => data.content)
      .then((updatedDevice) => {
        Log.debug("Updated device", updatedDevice);
        return Device.newFromDto(device);
      });
  }

  /**
   * Deletes given device under given application EUI
   * @param appEUI The application EUI for which the device resides
   * @param device The device object to be deleted
   */
  async deleteDevice(appEUI: string, device: Device): Promise<any> {
    return this.apiClient.http.delete(
      `/applications/${appEUI}/devices/${device.deviceEUI}`,
    ).then((res) => {
      Log.debug("Delete success!", res);
    });
  }
}
