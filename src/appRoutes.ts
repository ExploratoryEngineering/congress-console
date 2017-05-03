export let routes = [
  {
    route: [''],
    redirect: 'dashboard'
  },
  {
    route: ['login'],
    name: 'login',
    moduleId: 'views/login',
    nav: false,
    title: 'Login'
  },
  {
    route: ['dashboard'],
    name: 'dashboard',
    moduleId: 'views/application-dashboard',
    nav: true,
    title: 'Applications',
    settings: {
      auth: true
    }
  },
  {
    route: ['gateway-dashboard'],
    name: 'gateway-dashboard',
    moduleId: 'views/application-dashboard',
    nav: true,
    title: 'Gateways',
    settings: {
      auth: true
    }
  },
  {
    route: ['server-error'],
    name: 'server-error',
    moduleId: 'views/serverError',
    nav: false,
    title: 'Server issues - Stay calm',
    settings: {
      auth: false
    }
  }
];
