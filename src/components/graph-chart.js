import { bindable, bindingMode, containerless } from 'aurelia-framework';

import Chart from 'chart.js';

@containerless
export class GraphChart {
  @bindable chartData = {};
  @bindable chartOptions = {};
  @bindable chartType = 'line';
  @bindable({ defaultBindingMode: bindingMode.twoWay }) chart;

  canvas;

  createChart() {
    this.chart = new Chart(this.canvas, {
      type: this.chartType,
      data: this.chartData,
      options: this.chartOptions
    });
  }

  resetChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    this.createChart();
  }

  bind() {
    this.createChart();
  }

  unbind() {
    this.chart.destroy();
  }

  chartDataChanged() {
    this.chart.update();
  }

  chartOptionsChanged() {
    this.resetChart();
  }

  chartTypeChanged() {
    this.resetChart();
  }
}
