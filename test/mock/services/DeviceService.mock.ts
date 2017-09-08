export class DeviceServiceMock {
  fetchDevices() {
    return Promise.resolve([]);
  }
  fetchDeviceByEUI() {
    return Promise.resolve({});
  }
  fetchSourceForDevice() {
    return Promise.resolve('');
  }

  getTagsForDevice() {
    return Promise.resolve({});
  }
  addTagToDevice() {
    return Promise.resolve({});
  }
  deleteTagFromDevice() {
    return Promise.resolve();
  }

  fetchDeviceDataByEUI() {
    return Promise.resolve([]);
  }

  sendMessageToDevice() {
    return Promise.resolve();
  }

  createNewDevice() {
    return Promise.resolve({});
  }
  updateDevice() {
    return Promise.resolve({});
  }
  deleteDevice() {
    return Promise.resolve();
  }
}
