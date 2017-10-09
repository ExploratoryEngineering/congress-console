export class DialogControllerMock {
  close() {
    return Promise.resolve();
  }

  ok() {
    return Promise.resolve;
  }
}
