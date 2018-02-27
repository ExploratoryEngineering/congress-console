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

interface TokenDto {
  token: string;
  write: boolean;
  resource: string;
  tags: { [tagName: string]: string };
}

export class Token implements TagEntity {
  static newFromDto(token: TokenDto): Token {
    return new Token({
      token: token.token,
      write: token.write,
      resource: token.resource,
      tags: token.tags,
    });
  }

  static toDto(token: Token): TokenDto {
    return {
      token: token.token,
      write: token.write,
      resource: token.resource,
      tags: token.tags,
    };
  }

  token: string;
  write: boolean;
  resource: string;
  tags: { [tagName: string]: string };

  constructor({
    token = "",
    write = false,
    resource = "",
    tags = {},
  } = {}) {
    this.token = token;
    this.write = write;
    this.resource = resource;
    this.tags = tags;
  }

}
