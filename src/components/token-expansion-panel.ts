import { computedFrom } from 'aurelia-binding';
import { AureliaConfiguration } from 'aurelia-configuration';
import { bindable, autoinject, containerless } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { TagHelper } from 'Helpers/TagHelper';
import { LogBuilder } from 'Helpers/LogBuilder';

import { Application } from 'Models/Application';
import { Gateway } from 'Models/Gateway';
import { Token } from 'Models/Token';
import { TokenHelper } from 'Helpers/TokenHelper';

const Log = LogBuilder.create('Token expansion panel');

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
    private config: AureliaConfiguration
  ) { }

  toggle() {
    this.active = !this.active;
  }

  @computedFrom('token', 'applications', 'gateways')
  get description() {
    if (tokenHelper.isTokenDangling(this.token, { applications: this.applications, gateways: this.gateways })) {
      return 'The API key is not connected to any resource. It can safely be deleted.';
    }
    return tokenHelper.getDescription(this.token);
  }

  @computedFrom('token')
  get hasFullAccessToAllResources(): boolean {
    return tokenHelper.getTokenRights(this.token).resource === 'all';
  }

  @computedFrom('token')
  get hasAccessToAllGateways(): boolean {
    const tokenRights = tokenHelper.getTokenRights(this.token);
    return tokenRights.resource === 'all' || (tokenRights.resource === 'gateways' && tokenRights.resourceId === 'all');
  }

  @computedFrom('token')
  get hasAccessAllApplications(): boolean {
    const tokenRights = tokenHelper.getTokenRights(this.token);
    return tokenRights.resource === 'all' || (tokenRights.resource === 'applications' && tokenRights.resourceId === 'all');
  }

  @computedFrom('token')
  get hasAccessToSpecificApplication(): boolean {
    const tokenRights = tokenHelper.getTokenRights(this.token);
    return tokenRights.resource === 'applications' && tokenRights.resourceId !== 'all';
  }

  @computedFrom('token')
  get hasAccessToSpecificGateway(): boolean {
    const tokenRights = tokenHelper.getTokenRights(this.token);
    return tokenRights.resource === 'gateways' && tokenRights.resourceId !== 'all';
  }

  curlGetRoot() {
    return `curl
    -XGET ${this.config.get('api.endpoint')}/
    -HX-API-Token:${this.token.token}`;
  }

  curlGetTokens() {
    return `curl
    -XGET ${this.config.get('api.endpoint')}/tokens
    -HX-API-Token:${this.token.token}`;
  }

  curlGetApplications() {
    return `curl
    -XGET ${this.config.get('api.endpoint')}/applications
    -HX-API-Token:${this.token.token}`;
  }

  curlGetGateways() {
    return `curl
    -XGET ${this.config.get('api.endpoint')}/gateways
    -HX-API-Token:${this.token.token}`;
  }

  curlGetGatewayInformation() {
    return `curl
    -XGET ${this.config.get('api.endpoint')}${this.token.resource}
    -HX-API-Token:${this.token.token}`;
  }

  curlGetApplicationInformation() {
    return `curl
    -XGET ${this.config.get('api.endpoint')}${this.token.resource}
    -HX-API-Token:${this.token.token}`;
  }

  curlGetApplicationDevices() {
    return `curl
    -XGET ${this.config.get('api.endpoint')}${this.token.resource}/devices
    -HX-API-Token:${this.token.token}`;
  }

  curlGetApplicationData() {
    return `curl
    -XGET ${this.config.get('api.endpoint')}${this.token.resource}/data
    -HX-API-Token:${this.token.token}
    `;
  }

  deleteToken() {
    Log.debug('User wants to delete token', this.token);
    this.eventAggregator.publish('token:delete', this.token);
  }
}
