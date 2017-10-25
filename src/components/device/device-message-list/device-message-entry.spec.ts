import { DeviceMessageEntry } from './device-message-entry';
import { EventAggregatorMock } from 'Test/mock/mocks';

class CopyHelperMock {
  copyToClipBoard() {
    return Promise.resolve();
  }
}

class MouseEventMock {
  stopPropagation() { }
  preventDefault() { }
}

describe('Device message entry', () => {
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

  describe('lifecycle', () => {
    it('should reset toggled to false upon bind', () => {
      deviceMessageEntry.toggled = true;

      deviceMessageEntry.bind();

      expect(deviceMessageEntry.toggled).toBe(false);
    });
  });

  describe('copy as json', () => {
    it('should call stopPropagation and preventDefault', () => {
      deviceMessageEntry.copyHelper = copyHelperMock;

      let stopPropSpy = spyOn(mouseEventMock, 'stopPropagation');
      let preventDefaultSpy = spyOn(mouseEventMock, 'preventDefault');

      deviceMessageEntry.copyAsJson(mouseEventMock);


      expect(stopPropSpy).toHaveBeenCalled();
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should publish message upon successful copy success', (done) => {
      deviceMessageEntry.copyHelper = copyHelperMock;

      let publishSpy = spyOn(eventAggregatorMock, 'publish');
      deviceMessageEntry.copyAsJson(mouseEventMock).then(() => {
        expect(publishSpy).toHaveBeenCalled();
        done();
      });

    });
  });
});
