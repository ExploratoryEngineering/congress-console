import { autoinject } from 'aurelia-framework';
import { AureliaConfiguration } from 'aurelia-configuration';

import { Router } from 'aurelia-router';
import { UserInformation } from 'Helpers/UserInformation';

@autoinject
export class Login {
  constructor(
    private router: Router,
    private config: AureliaConfiguration
  ) { }

  login() {
    document.location.href = this.getLoginUrl();
  }

  logout() {
    document.location.href = this.getLogoutUrl();
  }

  getLoginUrl(): string {
    return `${this.config.get('api.endpoint')}/connect/login`;
  }

  getLogoutUrl(): string {
    return `${this.config.get('api.endpoint')}/connect/logout`;
  }
}
