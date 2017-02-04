import Debug from 'Helpers/Debug';

export class Network {
  netEui: string;
  netKey: number;
  nwkId: string;
  name: string;

  constructor({
    NetEUI = '',
    NetKey = Debug.getRandomNumber(),
    NwkID = '',
    Name = ''
  } = {}) {
    this.netEui = NetEUI;
    this.netKey = NetKey;
    this.nwkId = NwkID;
    this.name = Name;
  }
}
