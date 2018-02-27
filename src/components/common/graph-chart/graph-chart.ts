/*
	Copyright 2018 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

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
