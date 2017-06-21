import { Range } from 'Helpers/Range';
import { AureliaConfiguration } from 'aurelia-configuration';
import { autoinject, bindable } from 'aurelia-framework';
import { GraphController, GraphData } from 'Helpers/GraphController';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import * as moment from 'moment';

import { ApplicationService } from 'Services/ApplicationService';
import { DeviceService } from 'Services/DeviceService';

import { Device } from 'Models/Device';
import { Application } from 'Models/Application';

import { Websocket, WebsocketDeviceDataMessage, WebsocketStatusMessage, WebsocketMessage } from 'Helpers/Websocket';
import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Application details');

@autoinject
export class ServiceDetails {
  application: Application = new Application();
  allApplications: Application[] = [];
  selectableApplications: Application[] = [];
  hasMessageData: boolean = false;

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

  websocket: Websocket | null;

  constructor(
    private applicationService: ApplicationService,
    private deviceService: DeviceService,
    private router: Router,
    private eventAggregator: EventAggregator,
    private graphController: GraphController,
    private config: AureliaConfiguration
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

  onApplicationStreamMessage(message) {
    let wsMessage: WebsocketMessage = JSON.parse(message.data);

    if (wsMessage.type === 'KeepAlive') {
      let statusMessage: WebsocketStatusMessage = wsMessage;
    } else if (wsMessage.type === 'DeviceData') {
      let deviceMessage: WebsocketDeviceDataMessage = wsMessage;

      this.addChartData(deviceMessage);
      this.eventAggregator.publish('deviceDataMessage', deviceMessage.data);
    }
  }

  openApplicationDataStream() {
    if (!this.websocket) {
      this.websocket = new Websocket({
        url: `${this.config.get('api.wsEndpoint')}/applications/${this.application.appEUI}/stream`,
        onerror: (err) => { Log.error('WS Error', err); },
        onopen: (msg) => { Log.debug('WS Open: ', msg); },
        onclose: (msg) => { Log.debug('WS Close: ', msg); },
        onmessage: (msg) => { this.onApplicationStreamMessage(msg); }
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
      this.initiateChartData();
      this.openApplicationDataStream();
    }).catch(err => {
      Log.error(err);
      this.router.navigate('');
    });
  }

  deactivate() {
    this.closeApplicationStream();
  }
}
