import Debug from 'Helpers/Debug';

interface ApplicationDto {
  applicationEUI: string;
  appKey: string;
  name: string;
  networkEUI: string;
  tags: { [tagName: string]: string };
}

export class Application implements TagEntity {
  appEUI: string;
  appKey: string;
  name: string;
  netEUI: string;
  tags: { [tagName: string]: string };

  constructor({
    appEUI = Debug.getRandomHexString(),
    appKey = Debug.getRandomHexString(16, false),
    name = '',
    netEUI = '',
    tags = {}
  } = {}) {
    this.appEUI = appEUI;
    this.appKey = appKey;
    this.name = name;
    this.netEUI = netEUI;
    this.tags = tags;
  }

  /**
   * Returns a new Application from a dto
   */
  static newFromDto(dto: ApplicationDto): Application {
    return new Application({
      appEUI: dto.applicationEUI,
      appKey: dto.appKey,
      name: dto.name,
      netEUI: dto.networkEUI,
      tags: dto.tags,
    });
  }

  /**
   * Maps an Application to a dto
   */
  static toDto(application: Application): ApplicationDto {
    return {
      applicationEUI: application.appEUI,
      appKey: application.appKey,
      name: application.name,
      networkEUI: application.netEUI,
      tags: application.tags,
    };
  }
}
