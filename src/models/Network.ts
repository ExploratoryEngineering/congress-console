import Debug from 'Helpers/Debug';

export class Network {
  netEui: string;
  netKey: number;
  nwkId: string;
  name: string;

  constructor({
    NetworkEUI = '',
    NetworkKey = Debug.getRandomNumber(),
    NetID = '',
    Name = ''
  } = {}) {
    this.netEui = NetworkEUI;
    this.netKey = NetworkKey;
    this.nwkId = NetID;
    this.name = Name;
  }
}
