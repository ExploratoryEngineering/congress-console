import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DialogService } from 'aurelia-dialog';

import { ApplicationService } from 'Services/ApplicationService';
import { DeviceService } from 'Services/DeviceService';

import { Application } from 'Models/Application';
import { Device } from 'Models/Device';

import { CreateDeviceDialog } from 'Dialogs/createDeviceDialog';
import { MessageDialog } from 'Dialogs/messageDialog';

import { LogBuilder } from 'Helpers/LogBuilder';
const Log = LogBuilder.create('Application devices');

@autoinject
export class ServiceDetails {
  application: Application = new Application();
  allApplications: Application[] = [];
  selectableApplications: Application[] = [];
  subscriptions: any[] = [];

  devices: Device[] = [];

  constructor(
    private applicationService: ApplicationService,
    private deviceService: DeviceService,
    private dialogService: DialogService,
    private eventAggregator: EventAggregator,
    private router: Router
  ) { }

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

  deleteDevice(device: Device) {
    this.dialogService.open({
      viewModel: MessageDialog,
      model: {
        messageHeader: 'Delete device?',
        message: `Are you sure you want to delete the device with EUI: ${device.deviceEUI}`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    }).then(response => {
      if (!response.wasCancelled) {
        Log.debug('Deleting device');
        this.deviceService.deleteDevice(this.application.appEUI, device).then(() => {
          this.devices = this.devices.filter(dev => dev.deviceEUI !== device.deviceEUI);
        });
      } else {
        Log.debug('Did not delete device');
      }
    });
  }

  activate(args) {
    this.subscriptions.push(this.eventAggregator.subscribe('device:delete', (device) => {
      this.deleteDevice(device);
    }));

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

  deactivate() {
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.subscriptions = [];
  }
}
