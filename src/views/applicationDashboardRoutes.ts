import { PLATFORM } from 'aurelia-framework';

export const routes = [
  {
    route: ['', 'applications'],
    name: 'applications_overview',
    moduleId: PLATFORM.moduleName('./dashboard/applications'),
    nav: false,
    title: 'Applications'
  },
  {
    route: ['applications/:applicationId/details'],
    name: 'application_details',
    moduleId: PLATFORM.moduleName('./dashboard/applications/applicationDetails'),
    nav: true,
    href: '#/dashboard/application',
    title: 'Overview'
  },
  {
    route: ['applications/:applicationId/devices'],
    name: 'application_devices',
    moduleId: PLATFORM.moduleName('./dashboard/applications/applicationDevices'),
    nav: true,
    href: '#/dashboard/applications',
    title: 'Devices'
  },
  {
    route: ['applications/:applicationId/devices/:deviceId?'],
    name: 'application_device',
    moduleId: PLATFORM.moduleName('./dashboard/applications/applicationDevicesDetails'),
    nav: false,
    href: '#/dashboard/applications',
    title: 'Device'
  },
  {
    route: [':applicationId/integrations'],
    name: 'application_integrations',
    moduleId: PLATFORM.moduleName('./dashboard/applications/applicationIntegrations'),
    nav: true,
    href: '#/dashboard/applications',
    title: 'Integrations'
  }

];
