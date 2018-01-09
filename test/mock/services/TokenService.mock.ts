import { Token } from "Models/Token";

export class TokenServiceMock {
  fetchTokens(): Promise<Token[]> {
    return Promise.resolve([]);
  }

  createToken(token: Token): Promise<Token> {
    return Promise.resolve(token);
  }

  updateToken(token: Token): Promise<Token> {
    return Promise.resolve(token);
  }

  deleteToken(token: Token): Promise<any> {
    return Promise.resolve();
  }
}
