import Debug from 'Helpers/Debug';

interface ApplicationDto {
  applicationEUI: string;
  appKey: string;
  tags: { [tagName: string]: string };
}

export class Application implements TagEntity {
  appEUI: string;
  appKey: string;
  tags: { [tagName: string]: string };

  constructor({
    appEUI = '',
    appKey = '',
    tags = {}
  } = {}) {
    this.appEUI = appEUI;
    this.appKey = appKey;
    this.tags = tags;
  }

  /**
   * Returns a new Application from a dto
   */
  static newFromDto(dto: ApplicationDto): Application {
    return new Application({
      appEUI: dto.applicationEUI,
      appKey: dto.appKey,
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
      tags: application.tags,
    };
  }
}
