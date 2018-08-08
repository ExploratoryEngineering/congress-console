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
import { Gateway } from "Models/Gateway";
import { GatewayService } from "Services/GatewayService";

import * as moment from "moment";

const Log = LogBuilder.create("Gateway-card");

@containerless
@autoinject
export class GatewayCard {
  @bindable gateway: Gateway;

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
      }],
    },
    tooltips: {
      enabled: false,
    },
  };
  chartType = "bar";

  constructor(
    private eventAggregator: EventAggregator,
    private gatewayService: GatewayService,
  ) { }

  editGateway() {
    this.eventAggregator.publish("gateway:edit", this.gateway);
  }

  deleteGateway() {
    this.eventAggregator.publish("gateway:delete", this.gateway);
  }

  showEventLog() {
    this.eventAggregator.publish("gateway:eventLog", this.gateway);
  }

  initiateChartData() {
    this.gatewayService.fetchGatewayStatsByEUI(this.gateway.gatewayEUI).then((gatewayStats) => {
      this.chartData = {
        datasets: [{
          label: "Incoming - Count",
          fill: false,
          data: gatewayStats.messagesIn,
          backgroundColor: "rgba(255,255,255,.7)",
        }, {
          label: "Outgoing - Count",
          fill: false,
          data: gatewayStats.messagesOut,
          backgroundColor: "rgba(255,255,255,.7)",
        }],
        labels: gatewayStats.messagesIn.map((item, idx) => {
          return `${moment().subtract(idx + 1, "minutes").format()}`;
        }),
      };
    });
  }

  bind() {
    this.initiateChartData();
  }
}
