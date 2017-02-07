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
    route: ['applications/:applicationId/applicationDevices'],
    name: 'application_devices',
    moduleId: './dashboard/applications/applicationDevices',
    nav: true,
    href: '#/dashboard/applications',
    title: 'Devices'
  },
  {
    route: ['applications/:applicationId/settings'],
    name: 'application_settings',
    moduleId: './dashboard/services/serviceSettings',
    nav: true,
    href: '#/dashboard/services',
    title: 'Integration'
  }
];
