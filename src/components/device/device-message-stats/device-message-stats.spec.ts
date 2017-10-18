import { Device } from 'Models/Device';

import {
  DeviceServiceMock,
  EventAggregatorMock
} from 'Test/mock/mocks';



import { DeviceMessageStats } from './device-message-stats';

describe('Device messsage stats component', () => {
  let deviceMessageStats: DeviceMessageStats;
  let deviceMock: Device;
  let deviceServiceMock;
  let eventAggregatorMock;

  beforeEach(() => {
    deviceServiceMock = new DeviceServiceMock();
    eventAggregatorMock = new EventAggregatorMock();
    deviceMessageStats = new DeviceMessageStats(
      deviceServiceMock,
      eventAggregatorMock
    );

    deviceMessageStats.applicationEui = '1234';

    deviceMock = new Device({
      deviceEUI: '1234'
    });
    deviceMessageStats.device = deviceMock;
  });

  describe('Initialization', () => {
    it('should correctly subscribe to new deviceData from EventAggreagtor', () => {
      const eventAggregatorSpy = spyOn(eventAggregatorMock, 'subscribe');
      deviceMessageStats.bind();
      expect(eventAggregatorSpy).toHaveBeenCalledWith('deviceData', jasmine.anything());
    });

    it('should correctly fetch one data entry from given device', () => {
      const deviceServiceSpy = spyOn(deviceServiceMock, 'fetchDeviceDataByEUI').and.callThrough();

      deviceMessageStats.bind();
      expect(deviceServiceSpy).toHaveBeenCalledWith(
        '1234',
        '1234',
        {
          limit: 1,
          since: '0'
        }
      );
    });
  });
});
