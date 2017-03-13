import { AureliaConfiguration } from 'aurelia-configuration';
import { Router } from 'aurelia-router';
import { UserInformation } from 'Helpers/UserInformation';
import { autoinject } from 'aurelia-framework';

@autoinject
export class ProfileDropdown {
  userInformation: UserInformation;

  constructor(
    private router: Router,
    private config: AureliaConfiguration,
    userInformation: UserInformation
  ) {
    this.userInformation = userInformation;
  }

  logOut() {
    document.location.href = `${this.config.get('api.endpoint')}/connect/logout`;
  }
}
