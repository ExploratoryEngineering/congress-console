import { Range } from 'Helpers/Range';
import { DialogService } from 'aurelia-dialog';
import { autoinject, bindable, PLATFORM } from 'aurelia-framework';
import { GraphController, GraphData } from 'Helpers/GraphController';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import * as moment from 'moment';

import { ApplicationService } from 'Services/ApplicationService';
import { DeviceService } from 'Services/DeviceService';

import { Device } from 'Models/Device';
import { Application } from 'Models/Application';

import { ApplicationStream } from 'Helpers/ApplicationStream';
import { WebsocketDeviceDataMessage } from 'Helpers/Websocket';
import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Application details');

@autoinject
export class ServiceDetails {
  application: Application = new Application();
  allApplications: Application[] = [];
  selectableApplications: Application[] = [];
  hasMessageData: boolean = false;
  subscriptions: Subscription[] = [];

  chartData: GraphData;
  chartOptions = {
    maintainAspectRatio: false,
    showLines: true,
    spanGaps: true,
    gridLines: {
      display: true
    },
    legend: {
      display: true,
      position: 'right'
    },
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          beginAtZero: true,
          suggestedMax: 3
        }
      }],
      xAxes: [{
        display: true,
        type: 'time',
        ticks: {
          max: 8,
          min: 0
        }
      }]
    },
    tooltips: {
      enabled: true,
      callbacks: {
        title: function (tooltipItem, data) {
          return moment(parseInt(data.labels[tooltipItem[0].index], 10)).format('LTS');
        }
      }
    }
  };
  chartType = 'line';
  chart;

  @bindable
  selectedRange: Range = Range.LAST_SIX_HOURS;

  devices: Device[] = [];

  constructor(
    private applicationService: ApplicationService,
    private deviceService: DeviceService,
    private router: Router,
    private eventAggregator: EventAggregator,
    private dialogService: DialogService,
    private graphController: GraphController,
    private applicationStream: ApplicationStream
  ) { }

  initiateChartData() {
    this.applicationService.fetchApplicationDataByEUI(this.application.appEUI, { since: this.selectedRange.value }).then(messageData => {
      this.hasMessageData = messageData.length > 0;
      this.chartData = this.getChartData(messageData);
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
    let applicationUntouched = Object.assign({}, application);

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
