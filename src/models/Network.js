import Debug from 'Helpers/Debug';

export class Network {
  constructor({
    NetEUI = '',
    NetKey = Debug.getRandomNumber(),
    NwkID = '',
    Name = ''
  } = {}) {
    this.netEui = NetEUI;
    this.NetKey = NetKey;
    this.nwkId = NwkID;
    this.name = Name;
  }
}
