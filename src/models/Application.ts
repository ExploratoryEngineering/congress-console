import Debug from 'Helpers/Debug';

interface ApplicationDto {
  applicationEUI: string;
  appKey: string;
  name: string;
  tags: { [tagName: string]: string };
}

export class Application implements TagEntity {
  appEUI: string;
  appKey: string;
  name: string;
  tags: { [tagName: string]: string };

  constructor({
    appEUI = Debug.getRandomHexString(),
    appKey = Debug.getRandomHexString(16, false),
    name = '',
    tags = {}
  } = {}) {
    this.appEUI = appEUI;
    this.appKey = appKey;
    this.name = name;
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
      tags: application.tags,
    };
  }
}
