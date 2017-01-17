import { routes } from './dashboardRoutes';

export class Dashboard {

  configureRouter(config, router) {
    config.map(routes);

    this.router = router;
  }
}
