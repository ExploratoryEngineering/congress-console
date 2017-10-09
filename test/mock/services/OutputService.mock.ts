export class OutputServiceMock {
  getOutputByEui() {
    return Promise.resolve({});
  }

  getOutputsForApplication() {
    return Promise.resolve([]);
  }
}
