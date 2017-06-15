interface TokenDto {
  token: string;
  write: boolean;
  resource: string;
  tags: { [tagName: string]: string };
}

export class Token implements TagEntity {
  token: string;
  write: boolean;
  resource: string;
  tags: { [tagName: string]: string };

  constructor({
    token = '',
    write = false,
    resource = '',
    tags = {}
  } = {}) {
    this.token = token;
    this.write = write;
    this.resource = resource;
    this.tags = tags;
  }

  static newFromDto(token: TokenDto): Token {
    return new Token({
      token: token.token,
      write: token.write,
      resource: token.resource,
      tags: token.tags
    });
  }

  static toDto(token: Token): TokenDto {
    return {
      token: token.token,
      write: token.write,
      resource: token.resource,
      tags: token.tags
    };
  }
}
