import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DialogService } from 'aurelia-dialog';

import { ApplicationService } from 'Services/ApplicationService';
import { DeviceService } from 'Services/DeviceService';

import { Application } from 'Models/Application';
import { Device } from 'Models/Device';

import { CreateDeviceDialog } from 'Dialogs/createDeviceDialog';
import { MessageDialog } from 'Dialogs/messageDialog';

import { Conflict, BadRequestError } from 'Helpers/ResponseHandler';
import { LogBuilder } from 'Helpers/LogBuilder';
const Log = LogBuilder.create('Application devices');

@autoinject
export class ServiceDetails {
  application: Application = new Application();
  allApplications: Application[] = [];
  selectableApplications: Application[] = [];
  subscriptions: Subscription[] = [];

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
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        this.eventAggregator.publish('global:message', {
          body: 'Device created'
        });
        this.devices.push(response.output);
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
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        Log.debug('Deleting device');
        this.deviceService.deleteDevice(this.application.appEUI, device).then(() => {
          this.eventAggregator.publish('global:message', {
            body: 'Device deleted'
          });
          this.devices = this.devices.filter(dev => dev.deviceEUI !== device.deviceEUI);
        });
      } else {
        Log.debug('Did not delete device');
      }
    });
  }

  addTag(device: Device, tag: Tag) {
    return this.deviceService.addTagToDevice(this.application.appEUI, device.deviceEUI, tag).then((tagObject) => {
      device.tags = Object.assign(device.tags, tagObject);
      this.replaceDevice(device);
      this.eventAggregator.publish('global:message', { body: 'Tag created' });
    }).catch(error => {
      if (error instanceof Conflict) {
        this.eventAggregator.publish('global:message', { body: `Tag with key "${tag.key}" already exists.` });
      } else if (error instanceof BadRequestError) {
        this.eventAggregator.publish('global:message', { body: error.content });
      }
    });
  }

  editTag(device: Device, tag: Tag) {
    return this.deviceService.deleteTagFromDevice(this.application.appEUI, device.deviceEUI, tag).then(() => {
      return this.addTag(device, tag);
    });
  }

  deleteTag(device: Device, tag: Tag) {
    return this.dialogService.open({
      viewModel: MessageDialog,
      model: {
        messageHeader: 'Delete tag?',
        message: `Are you sure you want to delete the tag: ${tag.key}:${tag.value}`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        this.deviceService.deleteTagFromDevice(this.application.appEUI, device.deviceEUI, tag).then(() => {
          delete device.tags[tag.key];
          this.replaceDevice(device);
          this.eventAggregator.publish('global:message', {
            body: 'Tag deleted'
          });
        });
      } else {
        Log.debug('Did not delete tag');
      }
    });
  }

  private replaceDevice(device: Device) {
    this.devices.splice(this.devices.indexOf(device), 1, Object.assign({}, device));
  }

  activate(args) {
    this.subscriptions.push(this.eventAggregator.subscribe('device:delete', (device) => {
      this.deleteDevice(device);
    }));
    this.subscriptions.push(this.eventAggregator.subscribe('device:tag:new', ({ model, tag }) => {
      this.addTag(model, tag);
    }));
    this.subscriptions.push(this.eventAggregator.subscribe('device:tag:edit', ({ model, tag }) => {
      this.editTag(model, tag);
    }));
    this.subscriptions.push(this.eventAggregator.subscribe('device:tag:delete', ({ model, tag }) => {
      this.deleteTag(model, tag);
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
