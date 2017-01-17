import { Router } from 'aurelia-router';
import UserInformation from 'Helpers/UserInformation';

export class Login {
  heading = 'Login for Self Service Portal';

  static inject() {
    return [Router];
  }

  constructor(router) {
    this.router = router;
    this.userInformation = UserInformation;
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
