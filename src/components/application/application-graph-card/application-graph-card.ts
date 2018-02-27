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

import { bindable } from "aurelia-framework";
import * as moment from "moment";

import { GraphData } from "Helpers/GraphController";
import { Application } from "Models/Application";

export class ApplicationGraphCard {
  @bindable
  selectedRange;

  @bindable
  chartData: GraphData;
  chartOptions = {
    maintainAspectRatio: false,
    showLines: true,
    spanGaps: true,
    gridLines: {
      display: true,
    },
    legend: {
      display: true,
      position: "bottom",
    },
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          beginAtZero: true,
          suggestedMax: 3,
        },
      }],
      xAxes: [{
        display: true,
        type: "time",
        ticks: {
          max: 8,
          min: 0,
        },
      }],
    },
    tooltips: {
      enabled: true,
      callbacks: {
        title: function (tooltipItem, data) {
          return moment(parseInt(data.labels[tooltipItem[0].index], 10)).format("LTS");
        },
      },
    },
  };
  chartType = "line";

  @bindable
  application: Application;
}
