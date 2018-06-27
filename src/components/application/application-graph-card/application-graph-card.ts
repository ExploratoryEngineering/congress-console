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

import { DialogService } from "aurelia-dialog";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable, containerless, PLATFORM } from "aurelia-framework";
import { LogBuilder } from "Helpers/LogBuilder";
import { Range } from "Helpers/Range";
import * as moment from "moment";
import { ApplicationService } from "Services/ApplicationService";

import { create, DataMapperChain } from "@exploratoryengineering/data-mapper-chain";
import { ChartOptions } from "chart.js";
import { GraphController, GraphData } from "Helpers/GraphController";
import { Application } from "Models/Application";
import { Device } from "Models/Device";

const Log = LogBuilder.create("Application graph card");

@autoinject
@containerless
export class ApplicationGraphCard {
  @bindable
  selectedRange = Range.LAST_SIX_HOURS;

  @bindable
  chartData: GraphData;
  chartOptions: ChartOptions = {
    maintainAspectRatio: false,
    showLines: true,
    spanGaps: true,
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          beginAtZero: true,
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
          return moment(parseInt(data.labels[tooltipItem[0].index].toString(), 10)).format("LTS");
        },
      },
    },
  };
  chartType = "line";

  @bindable
  application: Application;
  @bindable
  mapperChain: DataMapperChain;
  @bindable
  devices: Device[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private dialogService: DialogService,
    private applicationService: ApplicationService,
    private graphController: GraphController,
    private eventAggregator: EventAggregator,
  ) { }

  initiateChartData() {
    Log.debug("Initiating chart data", this.application);
    this.applicationService.fetchApplicationDataByEUI(this.application.appEUI, { since: this.selectedRange.value, limit: 1000 }).then((messageData) => {
      this.chartData = this.getChartData(messageData);

      Log.debug("Got chart data", this.chartData);
    });
  }

  getChartData(messageData: MessageData[]) {
    const labelSet = this.graphController.generateLabelSetFromDevices(this.devices);
    if (!this.mapperChain) {
      return this.graphController.getGraph(messageData, { graphType: ["rssi"], labels: labelSet });
    } else {
      return this.graphController.getGraph(messageData, { graphType: [this.mapperChain], labels: labelSet });
    }
  }

  addChartData(wsMessage: MessageData) {
    const messageData: MessageData = wsMessage;
    if (messageData) {
      this.graphController.addToGraph(messageData, this.chartData);
      this.eventAggregator.publish("global:graphUpdated");
    }
  }

  createNewDataMapper() {
    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/createDataMapperChainDialog"),
    }).whenClosed((response) => {
      Log.debug("Response from returned dialog", response);
      if (!response.wasCancelled) {
        this.mapperChain = response.output;
        this.saveDataMapperChainToApplication();
      }
    });
  }

  removeMapper() {
    this.mapperChain = null;
    delete this.application.tags["data-mapper-chain"];
    this.applicationService.deleteApplicationTag(this.application, "data-mapper-chain");
  }

  selectedRangeChanged() {
    this.initiateChartData();
  }

  mapperChainChanged() {
    this.initiateChartData();
  }

  applicationChanged() {
    this.loadDataMapperChainFromApplication();
    this.initiateChartData();
  }

  bind() {
    this.subscriptions.push(this.eventAggregator.subscribe("deviceData", (deviceData: MessageData) => {
      this.addChartData(deviceData);
    }));

    this.loadDataMapperChainFromApplication();
    this.initiateChartData();
  }

  unbind() {
    this.subscriptions.forEach((subscription) => subscription.dispose());
    this.subscriptions = [];
  }

  private async saveDataMapperChainToApplication() {
    if (this.application.tags["data-mapper-chain"]) {
      await this.applicationService.deleteApplicationTag(this.application, "data-mapper-chain");
    }

    const tag: Tag = {
      key: "data-mapper-chain",
      value: window.btoa(this.mapperChain.serializeConfig()),
    };
    this.applicationService.createApplicationTag(this.application, tag);
  }

  private loadDataMapperChainFromApplication() {
    this.mapperChain = null;
    const dataMapperChain = this.application.tags["data-mapper-chain"];
    if (dataMapperChain) {
      this.mapperChain = create().loadConfig(window.atob(dataMapperChain));
    }
  }
}
