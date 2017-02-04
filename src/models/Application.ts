import Debug from 'Helpers/Debug';

export class Application {
  appEUI: string;
  appKey: string;
  name: string;
  netEUI: string;
  ownerId: number;

  constructor({
    appEUI = Debug.getRandomHexString(),
    appKey = Debug.getRandomHexString(16, false),
    name = '',
    netEUI = '',
    ownerId = Debug.getRandomNumber(1000)
  } = {}) {
    this.appEUI = appEUI;
    this.appKey = appKey;
    this.name = name;
    this.netEUI = netEUI;
    this.ownerId = ownerId;
  }

  /**
   * Returns a new Application from a dto
   */
  static newFromDto(dto): Application {
    return new Application({
      appEUI: dto.AppEUI,
      appKey: dto.AppKey,
      name: dto.Name,
      netEUI: dto.NetEUI,
      ownerId: dto.OwnerID
    });
  }

  /**
   * Maps an Application to a dto
   */
  static toDto(application: Application) {
    return {
      AppEUI: application.appEUI,
      AppKey: application.appKey,
      Name: application.name,
      NetEUI: application.netEUI,
      OwnerId: application.ownerId
    };
  }
}
