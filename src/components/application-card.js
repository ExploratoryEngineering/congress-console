import { bindable, containerless } from 'aurelia-framework';

import Debug from 'Helpers/Debug';

@containerless
export class ApplicationCard {
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


  unbind() {
    clearInterval(this.debugInterval);
  }

  bind() {
    this.initiateChartData();
  }
}
