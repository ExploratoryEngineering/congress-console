/*
	Copyright 2018 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

interface ApplicationDto {
  applicationEUI: string;
  tags: { [tagName: string]: string };
}

export class Application implements TagEntity {
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

  appEUI: string;
  tags: { [tagName: string]: string };

  constructor({
    appEUI = "",
    appKey = "",
    tags = {},
  } = {}) {
    this.appEUI = appEUI;
    this.tags = tags;
  }

}
