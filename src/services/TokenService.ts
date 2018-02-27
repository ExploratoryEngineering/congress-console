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

import { autoinject } from "aurelia-framework";
import { ApiClient } from "Helpers/ApiClient";

import { Token } from "Models/Token";

import { LogBuilder } from "Helpers/LogBuilder";
const Log = LogBuilder.create("Token service");

@autoinject
export class TokenService {
  constructor(
    private apiClient: ApiClient,
  ) { }

  fetchTokens(): Promise<Token[]> {
    return this.apiClient.http.get(`/tokens`)
      .then((data) => data.content.tokens)
      .then((tokens) => {
        return tokens.map(Token.newFromDto);
      });
  }

  createToken(token: Token): Promise<Token> {
    return this.apiClient.http.post("/tokens",
      Token.toDto(token),
    ).then((data) => data.content)
      .then((newToken) => {
        return Token.newFromDto(newToken);
      });
  }

  updateToken(token: Token): Promise<Token> {
    return this.apiClient.http.put("/tokens",
      Token.toDto(token),
    ).then((data) => data.content)
      .then((newToken) => {
        return Token.newFromDto(newToken);
      });
  }

  deleteToken(token: Token): Promise<any> {
    return this.apiClient.http.delete(`/tokens/${token.token}`)
      .then(() => {
        Log.debug("Delete successful");
      });
  }
}
