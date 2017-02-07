import { LogBuilder } from 'Helpers/LogBuilder';
import { NetworkInformation } from 'Helpers/NetworkInformation';
import { routes } from './dashboardRoutes';
import { Router } from 'aurelia-router';

const Log = LogBuilder.create('Application dashboard');

export class Dashboard {
  static inject = [NetworkInformation];

  router: Router;

  constructor(private networkInformation: NetworkInformation) {
    this.networkInformation = networkInformation;
  }

  configureRouter(config, router) {
    config.map(routes);

    this.router = router;
  }

  activate() {
    Log.debug('Activate');
    return this.networkInformation.fetchNetworks();
  }
}
