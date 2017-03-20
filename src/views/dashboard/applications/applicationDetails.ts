import { AureliaConfiguration } from 'aurelia-configuration';
import { autoinject } from 'aurelia-framework';
import { GraphController, GraphData } from 'Helpers/GraphController';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import * as moment from 'moment';

import { ApplicationService } from 'Services/ApplicationService';
import { DeviceService } from 'Services/DeviceService';

import { Device } from 'Models/Device';
import { Application } from 'Models/Application';

import { NetworkInformation } from 'Helpers/NetworkInformation';
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

  devices: Device[] = [];

  websocket: Websocket | null;

  constructor(
    private applicationService: ApplicationService,
    private deviceService: DeviceService,
    private router: Router,
    private networkInformation: NetworkInformation,
    private eventAggregator: EventAggregator,
    private graphController: GraphController,
    private config: AureliaConfiguration
  ) { }

  initiateChartData() {
    this.applicationService.fetchApplicationDataByEUI(this.application.appEUI).then(messageData => {
      this.hasMessageData = messageData.length > 0;
      this.chartData = this.getChartData(messageData);
    });
  }

  getChartData(messageData: MessageData[]) {
    return this.graphController.getGraph(messageData, { graphType: 'CO2' });
  }

  addChartData(wsMessage: WebsocketDeviceDataMessage) {
    Log.debug('Adding data');
    let messageData: MessageData = wsMessage.MessageBody;
    this.chartData = this.graphController.addToGraph(messageData, this.chartData);
  }

  onApplicationStreamMessage(message) {
    let wsMessage: WebsocketMessage = JSON.parse(message.data);

    if (wsMessage.MessageType === 'SocketStatus') {
      let statusMessage: WebsocketStatusMessage = wsMessage;
    } else if (wsMessage.MessageType === 'DeviceData') {
      let deviceMessage: WebsocketDeviceDataMessage = wsMessage;

      this.addChartData(deviceMessage);
      this.eventAggregator.publish('deviceDataMessage', deviceMessage);
    }
  }

  openApplicationDataStream() {
    if (!this.websocket) {
      this.websocket = new Websocket({
        url: `${this.config.get('api.wsEndpoint')}/networks/${this.networkInformation.selectedNetwork.netEui}/applications/${this.application.appEUI}/stream`,
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
