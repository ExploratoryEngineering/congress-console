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
    document.location.href = 'http://localhost:8080/connect/login';
  }

  logout() {
    document.location.href = 'http://localhost:8080/connect/logout';
  }
}
