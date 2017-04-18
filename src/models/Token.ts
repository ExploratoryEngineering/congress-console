interface TokenDto {
  Token: string;
  Write: boolean;
  Resource: string;
}

export class Token {
  token: string;
  write: boolean;
  resource: string;

  constructor({
    token = '',
    write = false,
    resource = ''
  } = {}) {
    this.token = token;
    this.write = write;
    this.resource = resource;
  }

  static newFromDto(token: TokenDto): Token {
    return new Token({
      token: token.Token,
      write: token.Write,
      resource: token.Resource
    });
  }

  static toDto(token: Token): TokenDto {
    return {
      Token: token.token,
      Write: token.write,
      Resource: token.resource
    };
  }
}
