import { DataMapperChain } from "@exploratoryengineering/data-mapper-chain";
import { autoinject } from "aurelia-framework";
import { ChartData } from "chart.js";
import { DataTransformer } from "Helpers/DataTransformer";
import { LogBuilder } from "Helpers/LogBuilder";
import { TagHelper } from "Helpers/TagHelper";
import { Device } from "Models/Device";

interface DataBucket {
  label: any;
  dataSets: MessageDataSet;
}

interface DataBucketSet {
  [timestampLabel: string]: DataBucket;
}

interface MessageDataSet {
  [dataEUI: string]: MessageData[];
}

export interface GraphData extends ChartData {
  graphConfig: GraphConfig;
  graphMetaData: GraphMetaData;
  messageData: MessageData[];
}

interface GraphDataSet {
  label: string;
  data: any[];
  backgroundColor: string;
  fill: boolean;
}

interface GraphMetaData {
  dataBucketSet: DataBucketSet;
  dataEUIs: string[];
}

interface LabelSet {
  [key: string]: string;
}

interface GraphConfig {
  graphType?: GraphType;
  chartDataColors?: string[];
  labels?: LabelSet;
}

type GraphType = Array<DataMapperChain | "count" | "count-aggregated" | "rssi">;

const Log = LogBuilder.create("Graph controller");

// A bunch of colors from http://epub.wu.ac.at/1692/1/document.pdf
const defaultColors = [
  "#023fa5",
  "#7d87b9",
  "#bec1d4",
  "#d6bcc0",
  "#bb7784",
  "#8e063b",
  "#4a6fe3",
  "#8595e1",
  "#b5bbe3",
  "#e6afb9",
  "#e07b91",
  "#d33f6a",
  "#11c638",
  "#8dd593",
  "#c6dec7",
  "#ead3c6",
  "#f0b98d",
  "#ef9708",
  "#0fcfc0",
  "#9cded6",
  "#d5eae7",
  "#f3e1eb",
  "#f6c4e1",
  "#f79cd4",
];

const tagHelper = new TagHelper();

@autoinject()
export class GraphController {
  chartDataColors: string[] = [];
  chartLabels: LabelSet = {};

  constructor(
    private dataTransformer: DataTransformer,
  ) { }

  generateLabelSetFromDevices(devices: Device[]): LabelSet {
    const labelSet: LabelSet = {};
    devices.forEach((device) => {
      labelSet[device.deviceEUI] = tagHelper.getEntityName(device);
    });
    return labelSet;
  }

  getGraph(messageData: MessageData[], { graphType = ["rssi"], chartDataColors = defaultColors, labels = {} }: GraphConfig = {}): GraphData {
    this.chartDataColors = chartDataColors;
    this.chartLabels = labels;
    const graphMetaData = this.createGraphMetaData(messageData);

    const dataBucketSet = graphMetaData.dataBucketSet;

    let graphDataSets: GraphDataSet[] = [];

    graphType.forEach((type) => {
      if (type instanceof DataMapperChain) {
        Log.debug("Got chain", type);
        graphDataSets = graphDataSets.concat(this.createDataMapperChainGraphDataSet(graphMetaData, type));
      } else {
        switch (type) {
          case "count-aggregated": {
            graphDataSets = graphDataSets.concat(this.createCountAggregatedGraphDataSet(graphMetaData));
            break;
          }
          case "rssi": {
            graphDataSets = graphDataSets.concat(this.createRssiGraphDataSet(graphMetaData));
            break;
          }
          default: {
            graphDataSets = graphDataSets.concat(this.createCountGraphDataSet(graphMetaData));
            break;
          }
        }
      }
    });

    return {
      datasets: graphDataSets,
      labels: this.getLabelsFromDataBucket(dataBucketSet),
      graphConfig: {
        graphType: graphType,
        chartDataColors: this.chartDataColors,
        labels: labels,
      },
      graphMetaData: graphMetaData,
      messageData: messageData,
    };
  }

  /**
   * Convenience method to add data to an existing GraphData object
   */
  addToGraph(messageData: MessageData, graphData: GraphData): GraphData {
    graphData.messageData.push(messageData);

    // Fetch the new dataset.
    const newGraphData = this.getGraph([messageData], graphData.graphConfig);

    // Copy meta data
    graphData.graphMetaData = newGraphData.graphMetaData;

    // APPEND the data sets.
    // So, long story. Chart.js does some min-max'ing in terms for optimization. They keep the reference and never diff internally. Yay.
    // That means we need to keep the internal reference, never overwrite the data object or labels. Super yay. That means a one-liner becomes
    // THIS
    const diffLabels = this.getLabelsFromDataBucket(newGraphData.graphMetaData.dataBucketSet)
      .filter((label) => graphData.labels.indexOf(label) < 0);
    diffLabels.forEach((newLabel) => {
      graphData.labels.push(newLabel);
    });

    newGraphData.datasets.forEach((newDataSet) => {
      const foundDataSet = graphData.datasets.find((dataSet) => {
        return newDataSet.label === dataSet.label;
      });

      if (foundDataSet) {
        (newDataSet.data as number[]).forEach((data) => {
          (foundDataSet.data as number[]).push(data);
        });

        graphData.datasets.filter((dataset) => {
          return dataset.label !== foundDataSet.label;
        }).forEach((dataSet) => {
          // Why add undefines I hear you say. Haha, well, otherwise everything will be skewed. Fun.
          (dataSet.data as any[]).push(undefined);
        });
      } else {
        newGraphData.datasets.forEach((dataset) => {
          (dataset.data as any[]).push(undefined);
        });
        // Fill with k undefined due to reason stated further up.
        const freshArrayWithUndefined = [];
        freshArrayWithUndefined[graphData.labels.length] = newDataSet.data[0];
        newDataSet.data = freshArrayWithUndefined;

        Log.debug("All new dataset.", newDataSet);
        newGraphData.datasets.push(newDataSet);
      }
    });

    return graphData;
  }

  /**
   * Create GraphDataSet based on the type 'count'
   */
  createDataMapperChainGraphDataSet(graphMetaData: GraphMetaData, dataMapperChain: DataMapperChain): GraphDataSet[] {
    let mapperChainGraphDataSet: GraphDataSet[] = [];

    graphMetaData.dataEUIs.forEach((uid, idx) => {
      const countGraphData = this.createDataMapperChainGraphData(uid, graphMetaData.dataBucketSet, dataMapperChain);

      mapperChainGraphDataSet = mapperChainGraphDataSet.concat([{
        label: `${this.chartLabels[uid] || uid} - ${dataMapperChain.name}`,
        fill: false,
        data: countGraphData.data,
        backgroundColor: this.getColorByIndex(idx),
      }]);
    });

    return mapperChainGraphDataSet;
  }

  /**
   * Create GraphData based on the type 'count'
   */
  createDataMapperChainGraphData(dataEUI: string, dataBucketSet: DataBucketSet, dataMapperChain: DataMapperChain) {
    const countData: { data: Array<number | undefined> } = { data: [] };

    Object.keys(dataBucketSet).forEach((label) => {
      const dataBucket = dataBucketSet[label];

      if (dataBucket.dataSets[dataEUI]) {
        countData.data.push(dataMapperChain.mapData(dataBucket.dataSets[dataEUI][0].data) as number);
      } else {
        countData.data.push(undefined);
      }
    });

    return countData;
  }

  /**
   * Create GraphDataSet based on the type 'count'
   */
  createCountGraphDataSet(graphMetaData: GraphMetaData): GraphDataSet[] {
    let countGraphDataSet: GraphDataSet[] = [];

    graphMetaData.dataEUIs.forEach((uid, idx) => {
      const countGraphData = this.createCountGraphData(uid, graphMetaData.dataBucketSet);

      countGraphDataSet = countGraphDataSet.concat([{
        label: `${this.chartLabels[uid] || uid} - Count`,
        fill: false,
        data: countGraphData.data,
        backgroundColor: this.getColorByIndex(idx),
      }]);
    });

    return countGraphDataSet;
  }

  /**
   * Create GraphData based on the type 'count'
   */
  createCountGraphData(dataEUI: string, dataBucketSet: DataBucketSet) {
    const countData: { data: Array<number | undefined> } = { data: [] };

    Object.keys(dataBucketSet).forEach((label) => {
      const dataBucket = dataBucketSet[label];

      if (dataBucket.dataSets[dataEUI]) {
        countData.data.push(dataBucket.dataSets[dataEUI].length);
      } else {
        countData.data.push(undefined);
      }
    });

    return countData;
  }

  /**
   * Create GraphDataSet based on the type 'count-aggregated'
   */
  createCountAggregatedGraphDataSet(graphMetaData: GraphMetaData): GraphDataSet[] {
    let aggregatedCountGraphDataSet: GraphDataSet[] = [];

    const data: number[] = [];

    Object.keys(graphMetaData.dataBucketSet).forEach((label) => {
      let labelCount = 0;

      Object.keys(graphMetaData.dataBucketSet[label].dataSets).forEach((uid) => {
        labelCount += graphMetaData.dataBucketSet[label].dataSets[uid].length;
      });

      data.push(labelCount);
    });

    aggregatedCountGraphDataSet = aggregatedCountGraphDataSet.concat([{
      label: `Number of received messages`,
      fill: false,
      data: data,
      backgroundColor: this.getColorByIndex(0),
    }]);

    return aggregatedCountGraphDataSet;
  }

  /**
   * Creates an RSSI graph dataset
   * @param graphMetaData GraphMetaData to be used for creation of the dataset
   */
  createRssiGraphDataSet(graphMetaData: GraphMetaData): GraphDataSet[] {
    let rssiGraphDataSet: GraphDataSet[] = [];

    graphMetaData.dataEUIs.forEach((uid, idx) => {
      const countGraphData = this.createRssiGraphData(uid, graphMetaData.dataBucketSet);

      rssiGraphDataSet = rssiGraphDataSet.concat([{
        label: `${this.chartLabels[uid] || uid} - RSSI`,
        fill: false,
        data: countGraphData.data,
        backgroundColor: this.getColorByIndex(idx),
      }]);
    });

    return rssiGraphDataSet;
  }
  /**
   * Create rssi graph data to be used in a data set
   * @param dataEUI EUI of the dataset
   * @param dataBucketSet The bucket set for the EUI
   */
  createRssiGraphData(dataEUI: string, dataBucketSet: DataBucketSet) {
    const countData: { data: Array<number | undefined> } = { data: [] };

    Object.keys(dataBucketSet).forEach((label) => {
      const dataBucket = dataBucketSet[label];

      if (dataBucket.dataSets[dataEUI]) {
        countData.data.push(dataBucket.dataSets[dataEUI][0].rssi);
      } else {
        countData.data.push(undefined);
      }
    });

    return countData;
  }

  private getLabelsFromDataBucket(dataBucketSet: DataBucketSet) {
    return Object.keys(dataBucketSet).map((dataKey) => dataBucketSet[dataKey].label);
  }

  /**
   * Fetches a chart color based on given index
   */
  private getColorByIndex(index: number): string {
    return this.chartDataColors[index % this.chartDataColors.length];
  }

  /**
   * Create GraphMetaData based on the given MessageData set
   */
  private createGraphMetaData(messageData: MessageData[]): GraphMetaData {
    const dataBucketSet: DataBucketSet = {};
    const messageDataSet: MessageDataSet = {};

    const dataEUIs: string[] = [];

    messageData.forEach((message) => {
      // Add data bucket set
      if (dataBucketSet[message.timestamp]) {
        dataBucketSet[message.timestamp].dataSets[message.deviceEUI] = [message];
      } else {
        dataBucketSet[message.timestamp] = {
          label: message.timestamp,
          dataSets: {},
        };
        dataBucketSet[message.timestamp].dataSets[message.deviceEUI] = [message];
      }
      // Add unique euis
      if (!dataEUIs.includes(message.deviceEUI)) {
        dataEUIs.push(message.deviceEUI);
      }
    });

    dataEUIs.sort((a, b) => {
      if (a < b) {
        return -1;
      } else {
        return 1;
      }
    });

    return {
      dataBucketSet: dataBucketSet,
      dataEUIs: dataEUIs,
    };
  }
}
