import { autoinject } from "aurelia-framework";
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

import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { bindable, bindingMode, containerless } from "aurelia-framework";
import * as Chart from "chart.js";
import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("Graph chart");

@autoinject
@containerless
export class GraphChart {
  @bindable chartData: any = {};
  @bindable chartOptions = {};
  @bindable chartType = "line";
  @bindable({ defaultBindingMode: bindingMode.twoWay }) chart: Chart;

  @bindable minHeight: string | boolean = false;

  canvas;
  subscriptions: Subscription[] = [];

  constructor(
    private eventAggregator: EventAggregator,
  ) { }

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
    this.subscriptions.push(this.eventAggregator.subscribe("global:graphUpdated", () => {
      this.updateChart();
    }));
  }

  updateChart() {
    Log.debug("Updating chart");
    this.chart.update();
  }

  unbind() {
    this.chart.destroy();
    this.subscriptions.forEach((sub) => sub.dispose());
    this.subscriptions = [];
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

  hasProp(property: string) {
    return this[property] || this[property] === "";
  }
}
