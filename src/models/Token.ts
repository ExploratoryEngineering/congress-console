interface TokenDto {
  Token: string;
  Write: boolean;
  Resource: string;
  Tags: { [tagName: string]: string };
}

export class Token {
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
      token: token.Token,
      write: token.Write,
      resource: token.Resource,
      tags: token.Tags
    });
  }

  static toDto(token: Token): TokenDto {
    return {
      Token: token.token,
      Write: token.write,
      Resource: token.resource,
      Tags: token.tags
    };
  }
}
