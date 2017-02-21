import { Redirect, Router } from 'aurelia-router';

import { routes } from './appRoutes';
import { UserInformation } from 'Helpers/UserInformation';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create();

export class App {
  constructor(
    private router: Router
  ) { }

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
      Log.debug('Auth protected route', navigationInstruction, !!UserInformation.isLoggedIn());
      let isLoggedIn = !!UserInformation.isLoggedIn(); // insert magic here;
      if (!isLoggedIn) {
        return next.cancel(new Redirect('login'));
      }
    }
    return next();
  }
}
