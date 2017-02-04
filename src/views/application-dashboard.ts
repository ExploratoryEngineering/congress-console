import { routes } from './dashboardRoutes';
import { Router } from 'aurelia-router';

export class Dashboard {
  router: Router;

  configureRouter(config, router) {
    config.map(routes);

    this.router = router;
  }
}
