import { PLATFORM } from 'aurelia-framework';

export let routes = [
  {
    route: [''],
    redirect: 'dashboard'
  },
  {
    route: ['login'],
    name: 'login',
    moduleId: PLATFORM.moduleName('views/login'),
    nav: false,
    title: 'Login'
  },
  {
    route: ['dashboard'],
    name: 'dashboard',
    moduleId: PLATFORM.moduleName('views/application-dashboard'),
    nav: true,
    title: 'Applications',
    settings: {
      auth: true
    }
  },
  {
    route: ['gateway-dashboard'],
    name: 'gateway-dashboard',
    moduleId: PLATFORM.moduleName('views/dashboard/gateways'),
    nav: true,
    title: 'Gateways',
    settings: {
      auth: true
    }
  },
  {
    route: ['server-error'],
    name: 'server-error',
    moduleId: PLATFORM.moduleName('views/serverError'),
    nav: false,
    title: 'Server issues - Stay calm',
    settings: {
      auth: false
    }
  }
];
