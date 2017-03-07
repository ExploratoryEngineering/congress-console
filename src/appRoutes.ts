export let routes = [
  {
    route: [''],
    redirect: 'dashboard'
  },
  {
    route: ['welcome'],
    name: 'welcome',
    moduleId: 'views/welcome',
    nav: false,
    title: 'Welcome'
  },
  {
    route: ['login'],
    name: 'login',
    moduleId: 'views/login',
    nav: false,
    title: 'Login'
  },
  {
    route: ['overview'],
    name: 'overview',
    moduleId: 'views/application-dashboard',
    nav: true,
    title: 'Overview',
    settings: {
      auth: true
    }
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
