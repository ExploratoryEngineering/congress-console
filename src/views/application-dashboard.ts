import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { LogBuilder } from "Helpers/LogBuilder";
import { routes } from "./applicationDashboardRoutes";

const Log = LogBuilder.create("Application dashboard");

@autoinject
export class Dashboard {
  router: Router;

  configureRouter(config, router) {
    config.map(routes);

    this.router = router;
  }
}
