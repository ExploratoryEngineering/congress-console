import Debug from 'Helpers/Debug';

export class Application {
  constructor({
    appEUI = Debug.getRandomHexString(),
    appKey = Debug.getRandomHexString(16, false),
    name = '',
    netEUI = '',
    ownerID = Debug.getRandomNumber(1000)
  } = {}) {
    this.appEUI = appEUI;
    this.appKey = appKey;
    this.name = name;
    this.netEUI = netEUI;
    this.ownerId = ownerID;
  }
}
