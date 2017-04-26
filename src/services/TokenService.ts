import { ApiClient } from 'Helpers/ApiClient';
import { NetworkInformation } from 'Helpers/NetworkInformation';
import { autoinject } from 'aurelia-framework';

import { Token } from 'Models/Token';

import { LogBuilder } from 'Helpers/LogBuilder';
const Log = LogBuilder.create('Token service');

@autoinject
export class TokenService {
  constructor(
    private apiClient: ApiClient,
    private networkInformation: NetworkInformation
  ) { }

  async fetchTokensForApplication(appEuid: string): Promise<Token[]> {
    let appResourcePath = await this.resourcePathForApplication(appEuid);

    return this.apiClient.http.get(`/tokens`)
      .then(data => data.content.tokens)
      .then(tokens => {
        return tokens.map(Token.newFromDto);
      })
      .then(tokens => {
        Log.debug('Fetched tokens', tokens);
        return tokens.filter(token => {
          return token.resource === appResourcePath;
        });
      });
  }

  createToken(token: Token): Promise<Token> {
    return this.apiClient.http.post('/tokens',
      Token.toDto(token)
    ).then(data => data.content)
      .then(token => {
        return Token.newFromDto(token);
      });
  }

  deleteToken(token: Token): Promise<any> {
    return this.apiClient.http.delete(`/tokens/${token.token}`)
      .then(() => {
        Log.debug('Delete successful');
      });
  }

  async resourcePathForApplication(appEui: string): Promise<string> {
    const { netEui } = await this.networkInformation.fetchSelectedNetwork();

    return `/networks/${netEui}/applications/${appEui}`;
  }
}
