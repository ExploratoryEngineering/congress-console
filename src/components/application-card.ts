import { GraphController } from 'Helpers/GraphController';
import { LogBuilder } from 'Helpers/LogBuilder';
import { Application } from 'Models/Application';
import { ApplicationService } from 'Services/ApplicationService';
import { bindable, containerless } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import Debug from 'Helpers/Debug';

const Log = LogBuilder.create('Application-card');

@containerless
export class ApplicationCard {
  static inject = [EventAggregator, ApplicationService, GraphController];

  eventAggregator: EventAggregator;

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
        ticks: {
          max: 8,
          min: 0
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

  constructor(eventAggregator, private applicationService: ApplicationService, private graphCreator: GraphController) {
    this.eventAggregator = eventAggregator;
  }

  initiateChartData() {
    this.applicationService.fetchApplicationDataByEUI(this.application.appEUI).then(messageData => {
      this.chartData = this.graphCreator.getGraph(messageData, {
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
