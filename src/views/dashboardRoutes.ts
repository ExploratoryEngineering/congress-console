export const routes = [
  {
    route: ['', 'applications'],
    name: 'applications_overview',
    moduleId: './dashboard/applications',
    nav: false,
    title: 'Applications'
  },
  {
    route: ['applications/:applicationId/details'],
    name: 'application_details',
    moduleId: './dashboard/applications/applicationDetails',
    nav: true,
    href: '#/dashboard/application',
    title: 'Overview'
  },
  {
    route: ['applications/:applicationId/devices'],
    name: 'application_devices',
    moduleId: './dashboard/applications/applicationDevices',
    nav: true,
    href: '#/dashboard/applications',
    title: 'Devices'
  },
  {
    route: ['applications/:applicationId/integrations'],
    name: 'application_integrations',
    moduleId: './dashboard/applications/applicationIntegrations',
    nav: true,
    href: '#/dashboard/applications',
    title: 'Integrations'
  }
];
