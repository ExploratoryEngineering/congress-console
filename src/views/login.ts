import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { UserInformation } from 'Helpers/UserInformation';

@autoinject
export class Login {
  heading = 'Login for Self Service Portal';

  constructor(
    private router: Router
  ) { }

  login() {
    UserInformation.setLoggedIn(true);
    this.router.navigate('application-dashboard');
  }

  logout() {
    UserInformation.setLoggedIn(false);
    this.router.navigate('');
  }
}
