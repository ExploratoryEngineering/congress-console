import { computedFrom } from 'aurelia-binding';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject, PLATFORM } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DialogService } from 'aurelia-dialog';

import { ApplicationService } from 'Services/ApplicationService';
import { DeviceService } from 'Services/DeviceService';

import { Application } from 'Models/Application';
import { Device } from 'Models/Device';

import { LogBuilder } from 'Helpers/LogBuilder';
const Log = LogBuilder.create('Application devices');

@autoinject
export class ApplicationDevices {
  router: Router;

  application: Application = new Application();
  allApplications: Application[] = [];
  selectableApplications: Application[] = [];

  devices: Device[] = [];

  constructor(
    private applicationService: ApplicationService,
    private deviceService: DeviceService,
    private dialogService: DialogService,
    private eventAggregator: EventAggregator,
    router: Router
  ) {
    this.router = router;
  }

  createNewDevice() {
    this.dialogService.open({
      viewModel: PLATFORM.moduleName('dialogs/createDeviceDialog'),
      model: {
        appEUI: this.application.appEUI
      }
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        this.eventAggregator.publish('global:message', {
          body: 'Device created'
        });
        this.devices.push(response.output);
        this.router.navigateToRoute('application_device', {
          applicationId: this.application.appEUI,
          deviceId: response.output.deviceEUI
        });
      }
    });
  }

  @computedFrom('devices')
  get hasDevicesWithWarnings(): boolean {
    return this.devices.some((device) => {
      return device.keyWarning;
    });
  }

  activate(args) {
    return Promise.all([
      this.applicationService.fetchApplications().then((applications) => {
        this.allApplications = applications;

        let selectedApplication = this.allApplications.find((application) => {
          return application.appEUI === args.applicationId;
        });

        if (selectedApplication) {
          this.application = selectedApplication;
        } else {
          return;
        }

        this.selectableApplications = this.allApplications.filter((application) => {
          return application.appEUI !== this.application.appEUI;
        });
      }),
      this.deviceService.fetchDevices(args.applicationId).then((devices) => {
        this.devices = devices;
      })
    ]).catch(err => {
      Log.error(err);
      this.router.navigate('');
    });
  }
}
