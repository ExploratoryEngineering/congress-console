import { Redirect, Router } from 'aurelia-router';

import { routes } from './appRoutes';
import UserInformation from 'Helpers/UserInformation';

export class App {
  static inject = [Router];

  constructor(router) {
    this.router = router;
    this.userInformation = UserInformation;
  }

  configureRouter(config, router) {
    config.title = 'Telenor LORA';
    config.addAuthorizeStep(new AuthorizeStep());
    config.map(routes);

    this.router = router;
  }
}

class AuthorizeStep {
  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
      console.log('Auth protected route', navigationInstruction, !!UserInformation.isLoggedIn());
      let isLoggedIn = !!UserInformation.isLoggedIn();// insert magic here;
      if (!isLoggedIn) {
        return next.cancel(new Redirect('login'));
      }
    }
    return next();
  }
}
