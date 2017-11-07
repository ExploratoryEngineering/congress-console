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
