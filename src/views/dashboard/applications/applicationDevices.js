import { Router } from 'aurelia-router';
import { DialogService } from 'aurelia-dialog';

import { ApplicationService } from 'Services/ApplicationService';
import { DeviceService } from 'Services/DeviceService';

import { CreateDeviceDialog } from 'Dialogs/createDeviceDialog';

export class ServiceDetails {
  static inject = [ApplicationService, DeviceService, DialogService, Router];

  application = {};
  allApplications = [];
  selectableApplications = [];

  devices = [];

  constructor(applicationService, deviceService, dialogService, router) {
    this.router = router;

    this.applicationService = applicationService;
    this.deviceService = deviceService;

    this.dialogService = dialogService;
  }

  createNewDevice() {
    this.dialogService.open({
      viewModel: CreateDeviceDialog,
      model: { appEUI: this.application.appEUI }
    }).then(response => {
      if (!response.wasCancelled) {
        this.deviceService.fetchDevices(this.application.appEUI).then((devices) => {
          this.devices = devices;
        });
      }
    });
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
      console.error(err);
      this.router.navigateToRoute('dashboard');
    });
  }
}
