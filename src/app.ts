import { autoinject } from "aurelia-framework";
import { Redirect, Router } from "aurelia-router";
import { BindingSignaler } from "aurelia-templating-resources";

import { UserInformation } from "Helpers/UserInformation";
import { routes } from "./appRoutes";

import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create();

@autoinject
export class App {
  router: Router;

  UPDATE_TIME_INTERVAL_MS: number = 10000;

  constructor(
    private userInformation: UserInformation,
    private signaler: BindingSignaler,
    router: Router,
  ) {
    this.router = router;
    setInterval(() => { this.signaler.signal("updateTime"); }, this.UPDATE_TIME_INTERVAL_MS);
  }

  getUnknownRoute() {
    return {
      route: ["404"],
      name: "notFound",
      moduleId: "views/notFound",
      nav: false,
      title: "404 - Missing stuff",
      settings: {
        auth: false,
      },
    };
  }

  configureRouter(config) {
    config.title = "Telenor LORA";
    config.options.pushState = true;
    config.mapUnknownRoutes(this.getUnknownRoute());
    config.addAuthorizeStep(new AuthorizeStep(this.userInformation));
    config.map(routes);
  }
}

class AuthorizeStep {
  constructor(
    private userInformation: UserInformation,
  ) { }

  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some((i) => i.config.settings.auth)) {
      Log.debug("Auth protected route", navigationInstruction, "Profile", this.userInformation.userProfile);

      return this.userInformation.fetchUserProfile().then(() => {
        return next();
      }).catch(() => {
        return next.cancel(new Redirect("login"));
      });
    } else {
      return next();
    }
  }
}
