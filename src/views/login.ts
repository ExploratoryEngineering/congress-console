import { Router } from 'aurelia-router';
import { UserInformation } from 'Helpers/UserInformation';

export class Login {
  static inject = [Router];

  heading = 'Login for Self Service Portal';
  router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  login() {
    UserInformation.setLoggedIn(true);
    this.router.navigate('application-dashboard');
  }

  logout() {
    UserInformation.setLoggedIn(false);
    this.router.navigate('');
  }
}
