import Debug from 'Helpers/Debug';

interface NetworkDto {
  Name: string;
  NetID: number;
  NetworkEUI: string;
  NetworkKey: string;
}

export class Network {
  netEui: string;
  netKey: string;
  nwkId: number;
  name: string;

  constructor({
    netEui = '',
    netKey = '',
    nwkId = Debug.getRandomNumber(),
    name = ''
  } = {}) {
    this.netEui = netEui;
    this.netKey = netKey;
    this.nwkId = nwkId;
    this.name = name;
  }

  /**
 * Returns a new Network from a dto
 */
  static newFromDto(dto: NetworkDto): Network {
    return new Network({
      netEui: dto.NetworkEUI,
      netKey: dto.NetworkKey,
      nwkId: dto.NetID,
      name: dto.Name
    });
  }
}
