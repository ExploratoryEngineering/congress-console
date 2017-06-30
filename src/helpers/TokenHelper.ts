import { Application } from 'Models/Application';
import { Gateway } from 'Models/Gateway';
import { Token } from 'Models/Token';

export interface TokenRights {
  resource: string;
  resourceId: string;
}

interface DanglingParams {
  applications?: Application[];
  gateways?: Gateway[];
}

export class TokenHelper {
  getDescription(token: Token): string {
    const tokenRights = this.getTokenRights(token);

    let accessString = ``;

    if (tokenRights.resource === 'all') {
      accessString = 'all resources';
    } else if (tokenRights.resourceId === 'all') {
      accessString = `all ${tokenRights.resource}`;
    } else {
      accessString = `${tokenRights.resource} with id ${tokenRights.resourceId}`;
    }

    return `The API key has ${token.write ? 'full' : 'read'} access to ${accessString}`;
  }

  getTokenRights(token: Token): TokenRights {
    const split = token.resource.split('\/');

    const resource = split[1] ? split[1] : 'all';
    const resourceId = split[2] ? split[2] : 'all';

    return {
      resource: resource,
      resourceId: resourceId
    };
  }

  isTokenDangling(token: Token, {
    applications = [],
    gateways = []
    }: DanglingParams = {}): boolean {
    const tokenRights = this.getTokenRights(token);

    if (tokenRights.resource === 'applications' && tokenRights.resourceId !== 'all') {
      let resource = applications.find(application => {
        return application.appEUI === tokenRights.resourceId;
      });

      return !resource;
    } else if (tokenRights.resource === 'gateways' && tokenRights.resourceId !== 'all') {
      let resource = gateways.find(gateway => {
        return gateway.gatewayEUI === tokenRights.resourceId;
      });

      return !resource;
    }

    return false;
  }
}
