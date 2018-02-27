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

import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, bindable, containerless } from "aurelia-framework";
import { LogBuilder } from "Helpers/LogBuilder";
import { Time } from "Helpers/Time";
import { Application } from "Models/Application";
import * as moment from "moment";
import { ApplicationService } from "Services/ApplicationService";

import Debug from "Helpers/Debug";

const Log = LogBuilder.create("Application-card");

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
      display: false,
    },
    legend: {
      display: false,
    },
    scales: {
      yAxes: [{
        display: false,
        ticks: {
          beginAtZero: true,
        },
      }],
      xAxes: [{
        display: false,
        type: "time",
        barThickness: 1,
        time: {
          min: Time.ONE_HOUR_AGO,
          max: Time.NOW,
          unit: "hour",
        },
      }],
    },
    tooltips: {
      enabled: false,
    },
  };
  chartType = "bar";

  constructor(
    private eventAggregator: EventAggregator,
    private applicationService: ApplicationService,
  ) { }

  initiateChartData() {
    this.applicationService.fetchApplicationStatsByEUI(this.application.appEUI).then((applicationStats) => {
      this.chartData = {
        datasets: [{
          label: "Incoming - Count",
          fill: false,
          data: applicationStats.messagesIn,
          backgroundColor: "rgba(255,255,255,.7)",
        }, {
          label: "Outgoing - Count",
          fill: false,
          data: applicationStats.messagesOut,
          backgroundColor: "rgba(255,255,255,.7)",
        }],
        labels: applicationStats.messagesIn.map((item, idx) => {
          return `${moment().subtract(idx + 1, "minutes").format()}`;
        }),
      };
    });
  }

  editApplication() {
    this.eventAggregator.publish("application:edit", this.application);
  }

  deleteApplication() {
    this.eventAggregator.publish("application:delete", this.application);
  }

  bind() {
    this.initiateChartData();
  }
}
