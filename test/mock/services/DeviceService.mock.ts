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

export class DeviceServiceMock {
  fetchDevices() {
    return Promise.resolve([]);
  }
  fetchDeviceByEUI() {
    return Promise.resolve({});
  }
  fetchSourceForDevice() {
    return Promise.resolve("");
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
