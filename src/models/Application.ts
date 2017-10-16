import Debug from 'Helpers/Debug';

interface ApplicationDto {
  applicationEUI: string;
  tags: { [tagName: string]: string };
}

export class Application implements TagEntity {
  appEUI: string;
  tags: { [tagName: string]: string };

  constructor({
    appEUI = '',
    appKey = '',
    tags = {}
  } = {}) {
    this.appEUI = appEUI;
    this.tags = tags;
  }

  /**
   * Returns a new Application from a dto
   */
  static newFromDto(dto: ApplicationDto): Application {
    return new Application({
      appEUI: dto.applicationEUI,
      tags: dto.tags,
    });
  }

  /**
   * Maps an Application to a dto
   */
  static toDto(application: Application): ApplicationDto {
    return {
      applicationEUI: application.appEUI,
      tags: application.tags,
    };
  }
}
