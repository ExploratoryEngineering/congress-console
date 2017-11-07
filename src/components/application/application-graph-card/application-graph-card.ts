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
