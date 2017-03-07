import { autoinject } from 'aurelia-framework';
import { Redirect, Router } from 'aurelia-router';

import { routes } from './appRoutes';
import { UserInformation } from 'Helpers/UserInformation';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create();

@autoinject
export class App {
  constructor(
    private router: Router,
    private userInformation: UserInformation
  ) { }

  getUnknownRoute() {
    return {
      route: ['404'],
      name: 'notFound',
      moduleId: 'views/notFound',
      nav: false,
      title: '404 - Missing stuff',
      settings: {
        auth: false
      }
    };
  }

  configureRouter(config) {
    config.title = 'Telenor LORA';
    config.mapUnknownRoutes(this.getUnknownRoute());
    config.addAuthorizeStep(new AuthorizeStep(this.userInformation));
    config.map(routes);
  }
}

class AuthorizeStep {
  constructor(
    private userInformation: UserInformation
  ) { }

  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
      Log.debug('Auth protected route', navigationInstruction, 'Profile', this.userInformation.userProfile);

      return this.userInformation.fetchUserProfile().then(() => {
        return next();
      }).catch(() => {
        return next.cancel(new Redirect('login'));
      });
    } else {
      return next();
    }
  }
}
