import { Router } from 'aurelia-router';

import { ApplicationService } from 'Services/ApplicationService';
import { DeviceService } from 'Services/DeviceService';

import { Device } from 'Models/Device';
import { Application } from 'Models/Application';

import { NetworkInformation } from 'Helpers/NetworkInformation';
import { Websocket } from 'Helpers/Websocket';
import { LogBuilder } from 'Helpers/LogBuilder';
const Log = LogBuilder.create('Application details');

export class ServiceDetails {
  static inject = [ApplicationService, DeviceService, Router, NetworkInformation];

  application: Application;
  allApplications: Application[] = [];
  selectableApplications: Application[] = [];

  router: Router;
  applicationService: ApplicationService;
  deviceService: DeviceService;
  networkInformation: NetworkInformation;

  devices: Device[] = [];

  websocket: Websocket | null;

  constructor(applicationService, deviceService, router, networkInformation: NetworkInformation) {
    this.router = router;

    this.applicationService = applicationService;
    this.deviceService = deviceService;
    this.networkInformation = networkInformation;
  }

  onApplicationStreamMessage(message) {
    Log.debug('WS Message: ', message, JSON.parse(message.data));
  }

  openApplicationStream() {
    if (!this.websocket) {
      this.websocket = new Websocket({
        url: `ws://10.5.10.253:8080/networks/${this.networkInformation.selectedNetwork.netEui}/applications/${this.application.appEUI}/stream`,
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
    Log.debug('Closing WS');
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
