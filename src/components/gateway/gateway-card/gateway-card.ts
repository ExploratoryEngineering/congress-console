import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, bindable, containerless } from "aurelia-framework";
import { LogBuilder } from "Helpers/LogBuilder";
import { Gateway } from "Models/Gateway";
import { GatewayService } from "Services/GatewayService";

import Debug from "Helpers/Debug";
import { Time } from "Helpers/Time";
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
