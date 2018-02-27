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

import { computedFrom } from "aurelia-binding";
import { bindable, containerless } from "aurelia-framework";

import "./signal-strength.scss";

export const LOW_SIGNAL_ICON_CLASS = "signal-strength__icon--low";
export const MEDIUM_SIGNAL_ICON_CLASS = "signal-strength__icon--medium";
export const HIGH_SIGNAL_ICON_CLASS = "signal-strength__icon--high";
export const UNKNOWN_SIGNAL_ICON_CLASS = "signal-strength__icon--unknown";

export const LOW_SIGNAL_THRESHOLD = -120;
export const HIGH_SIGNAL_THRESHOLD = -100;

export const UNKNOWN_SIGNAL_STRING = "Unknown";
export const SIGNAL_STRENGTH_UNIT = "dB";

@containerless
export class SignalStrength {
  @bindable
  messageData: MessageData;

  @bindable
  thresholds = {
    low: LOW_SIGNAL_THRESHOLD,
    high: HIGH_SIGNAL_THRESHOLD,
  };

  signalStrength: number = 0;
  signalStrengthString: string = UNKNOWN_SIGNAL_STRING;

  @computedFrom("messageData")
  get getIconClass(): string {
    if (!this.messageData) {
      return UNKNOWN_SIGNAL_ICON_CLASS;
    }

    this.signalStrengthString = `${this.messageData.rssi} ${SIGNAL_STRENGTH_UNIT}`;
    this.signalStrength = this.messageData.rssi;

    if (this.signalStrength < this.thresholds.low) {
      return LOW_SIGNAL_ICON_CLASS;
    } else if (this.signalStrength > this.thresholds.low && this.signalStrength < this.thresholds.high) {
      return MEDIUM_SIGNAL_ICON_CLASS;
    } else {
      return HIGH_SIGNAL_ICON_CLASS;
    }
  }
}
