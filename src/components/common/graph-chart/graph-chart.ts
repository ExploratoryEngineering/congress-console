import { bindable, bindingMode, containerless } from "aurelia-framework";
import { LogBuilder } from "Helpers/LogBuilder";

import Chart from "chart.js";

const Log = LogBuilder.create("Graph chart");

@containerless
export class GraphChart {
  @bindable chartData: any = {};
  @bindable chartOptions = {};
  @bindable chartType = "line";
  @bindable({ defaultBindingMode: bindingMode.twoWay }) chart;

  canvas;

  createChart() {
    this.chart = new Chart(this.canvas, {
      type: this.chartType,
      data: this.chartData,
      options: this.chartOptions,
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

  chartDataChanged(newData) {
    this.chart.data.datasets = newData.datasets;
    this.chart.data.labels = newData.labels;
    this.chart.update();
  }

  chartOptionsChanged() {
    this.resetChart();
  }

  chartTypeChanged() {
    this.resetChart();
  }
}
