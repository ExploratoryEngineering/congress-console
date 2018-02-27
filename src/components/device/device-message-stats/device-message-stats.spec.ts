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

import { Device } from "Models/Device";

import {
  DeviceServiceMock,
  EventAggregatorMock,
} from "Test/mock/mocks";

import { DeviceMessageStats } from "./device-message-stats";

describe("Device messsage stats component", () => {
  let deviceMessageStats: DeviceMessageStats;
  let deviceMock: Device;
  let deviceServiceMock;
  let eventAggregatorMock;

  beforeEach(() => {
    deviceServiceMock = new DeviceServiceMock();
    eventAggregatorMock = new EventAggregatorMock();
    deviceMessageStats = new DeviceMessageStats(
      deviceServiceMock,
      eventAggregatorMock,
    );

    deviceMessageStats.applicationEui = "1234";

    deviceMock = new Device({
      deviceEUI: "1234",
    });
    deviceMessageStats.device = deviceMock;
  });

  describe("Initialization", () => {
    it("should correctly subscribe to new deviceData from EventAggreagtor", () => {
      const eventAggregatorSpy = spyOn(eventAggregatorMock, "subscribe");
      deviceMessageStats.bind();
      expect(eventAggregatorSpy).toHaveBeenCalledWith("deviceData", jasmine.anything());
    });

    it("should correctly fetch one data entry from given device", () => {
      const deviceServiceSpy = spyOn(deviceServiceMock, "fetchDeviceDataByEUI").and.callThrough();

      deviceMessageStats.bind();
      expect(deviceServiceSpy).toHaveBeenCalledWith(
        "1234",
        "1234",
        {
          limit: 1,
          since: "0",
        },
      );
    });
  });
});
