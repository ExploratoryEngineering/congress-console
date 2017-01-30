import { bindable, containerless } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import Debug from 'Helpers/Debug';

@containerless
export class ApplicationCard {
  static inject = [EventAggregator];

  @bindable application;

  chartData = {
  };
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
        display: false
      }],
      xAxes: [{
        display: false
      }]
    },
    tooltips: {
      enabled: false
    }
  };
  chartType = 'bar';
  chart = {};

  debugInterval = '';

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
  }

  initiateChartData() {
    const randData = Debug.getRandomArray(20, 10000000);

    this.chartData = {
      labels: randData,
      datasets: [{
        data: randData,
        backgroundColor: 'rgba(255, 255, 255, .7)'
      }
      ]};

    this.setDataOnInterval();
  }

  setDataOnInterval() {
    this.debugInterval = setInterval(() => {
      const value = Debug.getRandomNumber(10000000);
      const data = Object.assign({}, this.chartData);

      data.datasets[0].data.splice(0, 1);
      data.datasets[0].data.push(value);

      this.chartData = data;
    }, 5000);
  }

  editApplication() {
    this.eventAggregator.publish('application:edit', this.application);
  }

  unbind() {
    clearInterval(this.debugInterval);
  }

  bind() {
    this.initiateChartData();
  }
}
