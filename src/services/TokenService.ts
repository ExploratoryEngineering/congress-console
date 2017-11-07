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

  fetchTokensForApplication(appEui: string): Promise<Token[]> {
    const appResourcePath = `/applicatoins/${appEui}`;

    return this.apiClient.http.get(`/tokens`)
      .then((data) => data.content.tokens)
      .then((tokens) => {
        return tokens.map(Token.newFromDto);
      })
      .then((tokens) => {
        Log.debug("Fetched tokens", tokens);
        return tokens.filter((token) => {
          return token.resource === appResourcePath;
        });
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

  deleteToken(token: Token): Promise<any> {
    return this.apiClient.http.delete(`/tokens/${token.token}`)
      .then(() => {
        Log.debug("Delete successful");
      });
  }
}
