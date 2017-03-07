import { Router } from 'aurelia-router';
import { UserInformation } from 'Helpers/UserInformation';
import { autoinject } from 'aurelia-framework';

@autoinject
export class ProfileDropdown {
  userInformation: UserInformation;

  constructor(
    private router: Router,
    userInformation: UserInformation
  ) {
    this.userInformation = userInformation;
  }

  logOut() {
    document.location.href = 'http://localhost:8080/connect/logout';
  }
}
