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

import {
  HIGH_SIGNAL_ICON_CLASS,
  HIGH_SIGNAL_THRESHOLD,
  LOW_SIGNAL_ICON_CLASS,
  LOW_SIGNAL_THRESHOLD,
  MEDIUM_SIGNAL_ICON_CLASS,
  SIGNAL_STRENGTH_UNIT,
  SignalStrength,
  UNKNOWN_SIGNAL_ICON_CLASS,
  UNKNOWN_SIGNAL_STRING,
} from "./signal-strength";

describe("Signal strength component", () => {
  let signalStrength: SignalStrength;
  let mockMessageData: MessageData;

  beforeEach(() => {
    signalStrength = new SignalStrength();
    mockMessageData = {
      devAddr: "",
      timestamp: 0,
      data: "",
      appEUI: "1234",
      deviceEUI: "1234",
      rssi: 0,
      snr: 0,
      frequency: 0,
      gatewayEUI: "1234",
      dataRate: "",
    };
  });

  describe("Icon classes", () => {
    it("should correctly return low signal class when having a low signal", () => {
      mockMessageData.rssi = LOW_SIGNAL_THRESHOLD - 1;
      signalStrength.messageData = mockMessageData;

      expect(signalStrength.getIconClass).toBe(LOW_SIGNAL_ICON_CLASS);
    });

    it("should correctly return medium signal class when having a medium signal", () => {
      mockMessageData.rssi = LOW_SIGNAL_THRESHOLD + 1;
      signalStrength.messageData = mockMessageData;

      expect(signalStrength.getIconClass).toBe(MEDIUM_SIGNAL_ICON_CLASS);
    });

    it("should correctly return high signal class when having a high signal", () => {
      mockMessageData.rssi = HIGH_SIGNAL_THRESHOLD + 1;
      signalStrength.messageData = mockMessageData;

      expect(signalStrength.getIconClass).toBe(HIGH_SIGNAL_ICON_CLASS);
    });

    it("should correctly return unknown when no messageData is supplied", () => {
      expect(signalStrength.getIconClass).toBe(UNKNOWN_SIGNAL_ICON_CLASS);
    });
  });

  describe("Text string", () => {
    it("should return unknown when no messageData is supplied", () => {
      expect(signalStrength.signalStrengthString).toBe(UNKNOWN_SIGNAL_STRING);
    });

    it("should return the value with the correct unit when messageData is supplied", () => {
      mockMessageData.rssi = 15;
      signalStrength.messageData = mockMessageData;
      const iconClass = signalStrength.getIconClass;
      expect(signalStrength.signalStrengthString).toBe(`15 ${SIGNAL_STRENGTH_UNIT}`);
    });
  });
});
