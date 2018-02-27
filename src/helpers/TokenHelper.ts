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

import { Application } from "Models/Application";
import { Gateway } from "Models/Gateway";
import { Token } from "Models/Token";

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

    if (tokenRights.resource === "all") {
      accessString = "all resources";
    } else if (tokenRights.resourceId === "all") {
      accessString = `all ${tokenRights.resource}`;
    } else {
      accessString = `${tokenRights.resource} with id ${tokenRights.resourceId}`;
    }

    return `The API key has ${token.write ? "full" : "read"} access to ${accessString}`;
  }

  getTokenRights(token: Token): TokenRights {
    const split = token.resource.split("\/");

    const resource = split[1] ? split[1] : "all";
    const resourceId = split[2] ? split[2] : "all";

    return {
      resource: resource,
      resourceId: resourceId,
    };
  }

  isTokenDangling(token: Token, {
    applications = [],
    gateways = [],
    }: DanglingParams = {}): boolean {
    const tokenRights = this.getTokenRights(token);

    if (tokenRights.resource === "applications" && tokenRights.resourceId !== "all") {
      const resource = applications.find((application) => {
        return application.appEUI === tokenRights.resourceId;
      });

      return !resource;
    } else if (tokenRights.resource === "gateways" && tokenRights.resourceId !== "all") {
      const resource = gateways.find((gateway) => {
        return gateway.gatewayEUI === tokenRights.resourceId;
      });

      return !resource;
    }

    return false;
  }
}
