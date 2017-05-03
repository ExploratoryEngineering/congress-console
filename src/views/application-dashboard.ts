import { autoinject } from 'aurelia-framework';
import { LogBuilder } from 'Helpers/LogBuilder';
import { NetworkInformation } from 'Helpers/NetworkInformation';
import { routes } from './dashboardRoutes';
import { Router } from 'aurelia-router';

const Log = LogBuilder.create('Application dashboard');

@autoinject
export class Dashboard {
  router: Router;

  constructor(
    private networkInformation: NetworkInformation
  ) { }

  configureRouter(config, router) {
    config.map(routes);

    this.router = router;
  }
}
