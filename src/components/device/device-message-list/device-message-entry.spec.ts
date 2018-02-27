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

import { EventAggregatorMock } from "Test/mock/mocks";
import { DeviceMessageEntry } from "./device-message-entry";

class CopyHelperMock {
  copyToClipBoard() {
    return Promise.resolve();
  }
}

class MouseEventMock {
  stopPropagation() { return; }
  preventDefault() { return; }
}

describe("Device message entry", () => {
  let deviceMessageEntry: DeviceMessageEntry;
  let eventAggregatorMock;
  let mouseEventMock;
  let copyHelperMock;

  beforeEach(() => {
    eventAggregatorMock = new EventAggregatorMock();
    mouseEventMock = new MouseEventMock();
    copyHelperMock = new CopyHelperMock();
    deviceMessageEntry = new DeviceMessageEntry(eventAggregatorMock);
  });

  describe("lifecycle", () => {
    it("should reset toggled to false upon bind", () => {
      deviceMessageEntry.toggled = true;

      deviceMessageEntry.bind();

      expect(deviceMessageEntry.toggled).toBe(false);
    });
  });

  describe("copy as json", () => {
    it("should call stopPropagation and preventDefault", () => {
      deviceMessageEntry.copyHelper = copyHelperMock;

      const stopPropSpy = spyOn(mouseEventMock, "stopPropagation");
      const preventDefaultSpy = spyOn(mouseEventMock, "preventDefault");

      deviceMessageEntry.copyAsJson(mouseEventMock);

      expect(stopPropSpy).toHaveBeenCalled();
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("should publish message upon successful copy success", (done) => {
      deviceMessageEntry.copyHelper = copyHelperMock;

      const publishSpy = spyOn(eventAggregatorMock, "publish");
      deviceMessageEntry.copyAsJson(mouseEventMock).then(() => {
        expect(publishSpy).toHaveBeenCalled();
        done();
      });

    });
  });
});
