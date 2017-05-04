export const routes = [
  {
    route: '',
    redirect: 'applications'
  },
  {
    route: ['applications'],
    name: 'applications_overview',
    moduleId: './dashboard/applications',
    nav: false,
    title: 'Applications'
  },
  {
    route: [':applicationId/details'],
    name: 'application_details',
    moduleId: './dashboard/applications/applicationDetails',
    nav: true,
    href: '#/dashboard/application',
    title: 'Overview'
  },
  {
    route: [':applicationId/devices'],
    name: 'application_devices',
    moduleId: './dashboard/applications/applicationDevices',
    nav: true,
    href: '#/dashboard/applications',
    title: 'Devices'
  }, {
    route: [':applicationId/integrations'],
    name: 'application_integrations',
    moduleId: './dashboard/applications/applicationIntegrations',
    nav: true,
    href: '#/dashboard/applications',
    title: 'Integrations'
  },
  {
    route: ['gateways'],
    name: 'gateways_overview',
    moduleId: './dashboard/gateways',
    nav: false,
    title: 'Gateways'
  }
];
