import { DialogService } from 'aurelia-dialog';
import { autoinject, bindable, PLATFORM } from 'aurelia-framework';
import { GraphController, GraphData } from 'Helpers/GraphController';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

import { ApplicationService } from 'Services/ApplicationService';
import { DeviceService } from 'Services/DeviceService';

import { Device } from 'Models/Device';
import { Application } from 'Models/Application';

import { Range } from 'Helpers/Range';
import { LogBuilder } from 'Helpers/LogBuilder';
import { ApplicationStream } from 'Helpers/ApplicationStream';
import { WebsocketDeviceDataMessage } from 'Helpers/Websocket';

const Log = LogBuilder.create('Application details');

@autoinject
export class ApplicationDetails {
  router: Router;

  application: Application = new Application();
  allApplications: Application[] = [];
  selectableApplications: Application[] = [];
  hasMessageData: boolean = false;
  subscriptions: Subscription[] = [];

  chartData: GraphData;

  @bindable
  selectedRange: Range = Range.LAST_SIX_HOURS;

  devices: Device[] = [];

  constructor(
    private applicationService: ApplicationService,
    private deviceService: DeviceService,
    private eventAggregator: EventAggregator,
    private dialogService: DialogService,
    private graphController: GraphController,
    private applicationStream: ApplicationStream,
    router: Router,
  ) {
    this.router = router;
  }

  initiateChartData() {
    Log.debug('Initiating chart data');
    this.applicationService.fetchApplicationDataByEUI(this.application.appEUI, { since: this.selectedRange.value }).then(messageData => {
      this.hasMessageData = messageData.length > 0;
      this.chartData = this.getChartData(messageData);

      Log.debug('Got chart data', this.chartData);
    });
  }

  getChartData(messageData: MessageData[]) {
    return this.graphController.getGraph(messageData, { graphType: 'rssi' });
  }

  addChartData(wsMessage: WebsocketDeviceDataMessage) {
    Log.debug('Adding data');
    let messageData: MessageData = wsMessage.data;
    this.chartData = this.graphController.addToGraph(messageData, this.chartData);
  }

  selectedRangeChanged() {
    this.initiateChartData();
  }

  editApplication(application: Application) {
    let applicationUntouched = { ...application };

    this.dialogService.open({
      viewModel: PLATFORM.moduleName('dialogs/editApplicationDialog'),
      model: {
        application: applicationUntouched
      }
    }).whenClosed(response => {
      Log.debug('Edit application', response);
      if (!response.wasCancelled) {
        this.application = response.output;
      }
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
    ]).then(() => {
      this.subscriptions.push(this.eventAggregator.subscribe('application:edit', (application: Application) => {
        this.editApplication(application);
      }));
      this.subscriptions.push(this.eventAggregator.subscribe('deviceData', (deviceData: WebsocketDeviceDataMessage) => {
        this.addChartData(deviceData);
      }));
      this.initiateChartData();
      this.applicationStream.openApplicationDataStream(this.application.appEUI);
    }).catch(err => {
      Log.error(err);
      this.router.navigate('');
    });
  }

  deactivate() {
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.subscriptions = [];
    this.applicationStream.closeApplicationStream();
  }
}
