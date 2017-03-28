import { Time } from 'Helpers/Time';
import { GraphController } from 'Helpers/GraphController';
import { LogBuilder } from 'Helpers/LogBuilder';
import { Application } from 'Models/Application';
import { ApplicationService } from 'Services/ApplicationService';
import { bindable, containerless, autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import Debug from 'Helpers/Debug';

const Log = LogBuilder.create('Application-card');

@containerless
@autoinject
export class ApplicationCard {
  UPDATE_INTERVAL = 5000;

  @bindable application: Application;

  chartData;
  chartOptions = {
    maintainAspectRatio: false,
    showLines: false,
    gridLines: {
      display: false
    },
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        display: false,
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        display: false,
        type: 'time',
        barThickness: 2,
        time: {
          min: Time.ONE_HOUR_AGO,
          max: Time.NOW,
          unit: 'hour'
        }
      }]
    },
    tooltips: {
      enabled: false
    }
  };
  chartType = 'bar';
  chart = {};

  dataInterval;

  constructor(
    private eventAggregator: EventAggregator,
    private applicationService: ApplicationService,
    private graphController: GraphController
  ) { }

  initiateChartData() {
    this.applicationService.fetchApplicationDataByEUI(this.application.appEUI, { since: Time.ONE_HOUR_AGO.format('X') }).then(messageData => {
      this.chartData = this.graphController.getGraph(messageData, {
        chartDataColors: ['rgba(255,255,255,.7)'],
        graphType: 'count-aggregated'
      });
    });
  }

  editApplication() {
    this.eventAggregator.publish('application:edit', this.application);
  }

  unbind() {
    clearInterval(this.dataInterval);
    this.dataInterval = null;
  }

  bind() {
    this.initiateChartData();
  }
}
