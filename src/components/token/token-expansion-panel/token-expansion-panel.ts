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

import { computedFrom } from "aurelia-binding";
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, bindable, containerless } from "aurelia-framework";

import { LogBuilder } from "Helpers/LogBuilder";
import { TagHelper } from "Helpers/TagHelper";

import { TokenHelper } from "Helpers/TokenHelper";
import { Application } from "Models/Application";
import { Gateway } from "Models/Gateway";
import { Token } from "Models/Token";

const Log = LogBuilder.create("Token expansion panel");

const th = new TagHelper();
const tokenHelper = new TokenHelper();

@autoinject
@containerless
export class TokenExpansionPanel {
  @bindable
  token: Token = new Token();
  @bindable
  active: boolean = false;
  @bindable
  applications: Application[] = [];
  @bindable
  gateways: Gateway[] = [];

  constructor(
    private eventAggregator: EventAggregator,
  ) { }

  toggle() {
    this.active = !this.active;
  }

  @computedFrom("token", "applications", "gateways")
  get description() {
    if (tokenHelper.isTokenDangling(this.token, { applications: this.applications, gateways: this.gateways })) {
      return "The API key is not connected to any resource. It can safely be deleted.";
    }
    return tokenHelper.getDescription(this.token);
  }

  @computedFrom("token")
  get hasFullAccessToAllResources(): boolean {
    return tokenHelper.getTokenRights(this.token).resource === "all";
  }

  @computedFrom("token")
  get hasAccessToAllGateways(): boolean {
    const tokenRights = tokenHelper.getTokenRights(this.token);
    return tokenRights.resource === "all" || (tokenRights.resource === "gateways" && tokenRights.resourceId === "all");
  }

  @computedFrom("token")
  get hasAccessAllApplications(): boolean {
    const tokenRights = tokenHelper.getTokenRights(this.token);
    return tokenRights.resource === "all" || (tokenRights.resource === "applications" && tokenRights.resourceId === "all");
  }

  @computedFrom("token")
  get hasAccessToSpecificApplication(): boolean {
    const tokenRights = tokenHelper.getTokenRights(this.token);
    return tokenRights.resource === "applications" && tokenRights.resourceId !== "all";
  }

  @computedFrom("token")
  get hasAccessToSpecificGateway(): boolean {
    const tokenRights = tokenHelper.getTokenRights(this.token);
    return tokenRights.resource === "gateways" && tokenRights.resourceId !== "all";
  }

  curlGetRoot() {
    return `curl
    -XGET ${CONGRESS_ENDPOINT}/
    -HX-API-Token:${this.token.token}`;
  }

  curlGetTokens() {
    return `curl
    -XGET ${CONGRESS_ENDPOINT}/tokens
    -HX-API-Token:${this.token.token}`;
  }

  curlGetApplications() {
    return `curl
    -XGET ${CONGRESS_ENDPOINT}/applications
    -HX-API-Token:${this.token.token}`;
  }

  curlGetGateways() {
    return `curl
    -XGET ${CONGRESS_ENDPOINT}/gateways
    -HX-API-Token:${this.token.token}`;
  }

  curlGetGatewayInformation() {
    return `curl
    -XGET ${CONGRESS_ENDPOINT}${this.token.resource}
    -HX-API-Token:${this.token.token}`;
  }

  curlGetApplicationInformation() {
    return `curl
    -XGET ${CONGRESS_ENDPOINT}${this.token.resource}
    -HX-API-Token:${this.token.token}`;
  }

  curlGetApplicationDevices() {
    return `curl
    -XGET ${CONGRESS_ENDPOINT}${this.token.resource}/devices
    -HX-API-Token:${this.token.token}`;
  }

  curlGetApplicationData() {
    return `curl
    -XGET ${CONGRESS_ENDPOINT}${this.token.resource}/data
    -HX-API-Token:${this.token.token}
    `;
  }

  editToken() {
    Log.debug("User wants to edit token", this.token);
    this.eventAggregator.publish("token:edit", this.token);
  }

  deleteToken() {
    Log.debug("User wants to delete token", this.token);
    this.eventAggregator.publish("token:delete", this.token);
  }
}
