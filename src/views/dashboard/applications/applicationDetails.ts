import { Router } from 'aurelia-router';

import { ApplicationService } from 'Services/ApplicationService';
import { DeviceService } from 'Services/DeviceService';

import { Device } from 'Models/Device';
import { Application } from 'Models/Application';

import NetworkInformation from 'Helpers/NetworkInformation';
import { Websocket } from 'Helpers/Websocket';
import { LogBuilder } from 'Helpers/LogBuilder';
const Log = LogBuilder.create('Application details');

export class ServiceDetails {
  static inject = [ApplicationService, DeviceService, Router];

  application: Application;
  allApplications: Application[] = [];
  selectableApplications: Application[] = [];

  router: Router;
  applicationService: ApplicationService;
  deviceService: DeviceService;

  devices: Device[] = [];

  websocket: Websocket | null;

  constructor(applicationService, deviceService, router) {
    this.router = router;

    this.applicationService = applicationService;
    this.deviceService = deviceService;
  }

  onApplicationStreamMessage(message) {
    Log.debug('WS Message: ', message, JSON.parse(message.data));
  }

  openApplicationStream() {
    if (!this.websocket) {
      this.websocket = new Websocket({
        url: `ws://localhost:8080/networks/${NetworkInformation.selectedNetwork}/applications/${this.application.appEUI}/data`,
        onerror: (err) => { Log.error('WS Error', err); },
        onopen: (msg) => { Log.debug('WS Open: ', msg); },
        onclose: (msg) => { Log.debug('WS Close: ', msg); },
        onmessage: this.onApplicationStreamMessage
      });
    } else {
      this.websocket.reconnect();
    }
  }

  closeApplicationStream() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
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
    ]).then(() => {
      this.openApplicationStream();
    }).catch(err => {
      Log.error(err);
      this.router.navigateToRoute('dashboard');
    });
  }

  deactivate() {
    this.closeApplicationStream();
  }
}
