import { Router } from 'aurelia-router';

import { ApplicationService } from 'Services/ApplicationService';
import { DeviceService } from 'Services/DeviceService';

import { LogBuilder } from 'Helpers/LogBuilder';
const Log  = LogBuilder.create('Application details');

export class ServiceDetails {
  static inject = [ApplicationService, DeviceService, Router];

  application = {};
  allApplications = [];
  selectableApplications = [];

  devices = [];

  constructor(applicationService, deviceService, router) {
    this.router = router;

    this.applicationService = applicationService;
    this.deviceService = deviceService;
  }

  activate(args) {
    return Promise.all([
      this.applicationService.fetchApplications().then((applications) => {
        this.allApplications = applications;

        this.application = this.allApplications.find((application) => {
          return application.appEUI === args.applicationId;
        });
        this.selectableApplications = this.allApplications.filter((application) => {
          return application.appEUI !== this.application.appEUI;
        });
      }),
      this.deviceService.fetchDevices(args.applicationId).then((devices) => {
        this.devices = devices;
      })
    ]).catch(err => {
      Log.error(err);
      this.router.navigateToRoute('dashboard');
    });
  }
}
