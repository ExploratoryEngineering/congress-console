import Debug from 'Helpers/Debug';

interface ApplicationDto {
  ApplicationEUI: string;
  AppKey: string;
  Name: string;
  NetworkEUI: string;
}

export class Application {
  appEUI: string;
  appKey: string;
  name: string;
  netEUI: string;

  constructor({
    appEUI = Debug.getRandomHexString(),
    appKey = Debug.getRandomHexString(16, false),
    name = '',
    netEUI = '',
  } = {}) {
    this.appEUI = appEUI;
    this.appKey = appKey;
    this.name = name;
    this.netEUI = netEUI;
  }

  /**
   * Returns a new Application from a dto
   */
  static newFromDto(dto: ApplicationDto): Application {
    return new Application({
      appEUI: dto.ApplicationEUI,
      appKey: dto.AppKey,
      name: dto.Name,
      netEUI: dto.NetworkEUI,
    });
  }

  /**
   * Maps an Application to a dto
   */
  static toDto(application: Application): ApplicationDto {
    return {
      ApplicationEUI: application.appEUI,
      AppKey: application.appKey,
      Name: application.name,
      NetworkEUI: application.netEUI
    };
  }
}
