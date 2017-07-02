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
    document.location.href = `${this.config.get('api.endpoint')}/connect/login`;
  }

  logout() {
    document.location.href = `${this.config.get('api.endpoint')}/connect/logout`;
  }
}
