import { LogBuilder } from 'Helpers/LogBuilder';
import { autoinject } from 'aurelia-framework';
import { DataTransformer } from 'Helpers/DataTransformer';

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

export interface GraphData {
  datasets: GraphDataSet[];
  labels: any[];
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

interface GraphConfig {
  graphType?: GraphType;
  chartDataColors?: string[];
}

type GraphType = 'count' | 'count-aggregated' | 'CO2' | 'rssi';

const Log = LogBuilder.create('Graph controller');

// A bunch of colors from http://epub.wu.ac.at/1692/1/document.pdf
const defaultColors = [
  '#023fa5',
  '#7d87b9',
  '#bec1d4',
  '#d6bcc0',
  '#bb7784',
  '#8e063b',
  '#4a6fe3',
  '#8595e1',
  '#b5bbe3',
  '#e6afb9',
  '#e07b91',
  '#d33f6a',
  '#11c638',
  '#8dd593',
  '#c6dec7',
  '#ead3c6',
  '#f0b98d',
  '#ef9708',
  '#0fcfc0',
  '#9cded6',
  '#d5eae7',
  '#f3e1eb',
  '#f6c4e1',
  '#f79cd4'
];

const mapper = {
  '00-09-09-00-00-00-00-0a': 'Roald',
  '00-09-09-00-00-00-00-09': 'BRB',
  '00-09-09-00-00-00-00-0b': 'WTF',
  '00-09-09-00-00-00-00-07': 'Sune',
  '00-09-09-00-00-00-00-0c': 'Game room',
  '00-09-09-00-00-00-00-08': 'Column EE'
};

@autoinject()
export class GraphController {
  chartDataColors: string[] = [];

  constructor(
    private dataTransformer: DataTransformer
  ) { }

  getGraph(messageData: MessageData[], { graphType = 'CO2', chartDataColors = defaultColors }: GraphConfig = {}): GraphData {
    this.chartDataColors = chartDataColors;
    let graphMetaData = this.createGraphMetaData(messageData);

    let dataBucketSet = graphMetaData.dataBucketSet;
    let dataEUIs = graphMetaData.dataEUIs;

    let graphDataSets: GraphDataSet[] = [];

    switch (graphType) {
      case 'CO2': {
        graphDataSets = graphDataSets.concat(this.createCO2GraphDataSet(graphMetaData));
        break;
      }
      case 'count-aggregated': {
        graphDataSets = graphDataSets.concat(this.createCountAggregatedGraphDataSet(graphMetaData));
        break;
      }
      case 'rssi': {
        graphDataSets = graphDataSets.concat(this.createRssiGraphDataSet(graphMetaData));
        break;
      }
      default: {
        graphDataSets = graphDataSets.concat(this.createCountGraphDataSet(graphMetaData));
        break;
      }
    }

    return {
      datasets: graphDataSets,
      labels: this.getLabelsFromDataBucket(dataBucketSet),
      graphConfig: {
        graphType: graphType,
        chartDataColors: this.chartDataColors
      },
      graphMetaData: graphMetaData,
      messageData: messageData
    };
  }

  /**
   * Convenience method to add data to an existing GraphData object
   */
  addToGraph(messageData: MessageData, graphData: GraphData): GraphData {
    Log.debug('Adding to graph');
    graphData.messageData.push(messageData);

    let newGraphData = this.getGraph(graphData.messageData, graphData.graphConfig);

    // Copy meta data
    graphData.graphMetaData = newGraphData.graphMetaData;

    // Copy the actual data sets
    graphData.labels = this.getLabelsFromDataBucket(newGraphData.graphMetaData.dataBucketSet);
    graphData.datasets = newGraphData.datasets;

    return graphData;
  }

  /**
   * Create GraphDataSet based on the type 'count'
   */
  createCountGraphDataSet(graphMetaData: GraphMetaData): GraphDataSet[] {
    let countGraphDataSet: GraphDataSet[] = [];

    graphMetaData.dataEUIs.forEach((uid, idx) => {
      let countGraphData = this.createCountGraphData(uid, graphMetaData.dataBucketSet);

      countGraphDataSet = countGraphDataSet.concat([{
        label: `${uid} - Count`,
        fill: false,
        data: countGraphData.data,
        backgroundColor: this.getColorByIndex(idx)
      }]);
    });

    return countGraphDataSet;
  }

  /**
   * Create GraphData based on the type 'count'
   */
  createCountGraphData(dataEUI: string, dataBucketSet: DataBucketSet) {
    let countData: { data: Array<number | undefined> } = { data: [] };

    Object.keys(dataBucketSet).forEach((label) => {
      let dataBucket = dataBucketSet[label];

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

    let data: number[] = [];

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
      backgroundColor: this.getColorByIndex(0)
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
      let countGraphData = this.createRssiGraphData(uid, graphMetaData.dataBucketSet);

      rssiGraphDataSet = rssiGraphDataSet.concat([{
        label: `${mapper[uid] ? mapper[uid] : uid} - RSSI`,
        fill: false,
        data: countGraphData.data,
        backgroundColor: this.getColorByIndex(idx)
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
    let countData: { data: Array<number | undefined> } = { data: [] };

    Object.keys(dataBucketSet).forEach((label) => {
      let dataBucket = dataBucketSet[label];

      if (dataBucket.dataSets[dataEUI]) {
        countData.data.push(dataBucket.dataSets[dataEUI][0].rssi);
      } else {
        countData.data.push(undefined);
      }
    });

    return countData;
  }

  /**
   * Create GraphDataSet based on the type 'CO2'
   */
  createCO2GraphDataSet(graphMetaData: GraphMetaData): GraphDataSet[] {
    let co2GraphDataSets: GraphDataSet[] = [];

    graphMetaData.dataEUIs.forEach((uid, idx) => {
      let co2GraphData = this.createCO2GraphData(uid, graphMetaData.dataBucketSet);

      co2GraphDataSets = co2GraphDataSets.concat([{
        label: `${mapper[uid] ? mapper[uid] : uid} - Sensor #1`,
        fill: false,
        data: co2GraphData.sensorOne,
        backgroundColor: this.getColorByIndex(idx)
      }, {
        label: `${mapper[uid] ? mapper[uid] : uid} - Sensor #2`,
        fill: false,
        data: co2GraphData.sensorTwo,
        backgroundColor: this.getColorByIndex(idx)
      }]);
    });

    return co2GraphDataSets;
  }

  /**
   * Create GraphData based on the type 'CO2'
   */
  createCO2GraphData(dataEUI: string, dataBucketSet: DataBucketSet) {
    let co2Data: {
      sensorOne: any[],
      sensorTwo: any[],
      sensorTwoStatus: any[]
    } = {
        sensorOne: [],
        sensorTwo: [],
        sensorTwoStatus: []
      };

    Object.keys(dataBucketSet).forEach((label) => {
      let dataBucket = dataBucketSet[label];

      if (dataBucket.dataSets[dataEUI]) {
        let transformation = this.dataTransformer.transformCO2Message(dataBucket.dataSets[dataEUI][0]);

        co2Data.sensorOne.push(transformation.data.sensorOne);
        co2Data.sensorTwo.push(transformation.data.sensorTwo);
        co2Data.sensorTwoStatus.push(transformation.data.sensorStatus);
      } else {
        co2Data.sensorOne.push(undefined);
        co2Data.sensorTwo.push(undefined);
        co2Data.sensorTwoStatus.push(undefined);
      }
    });

    return co2Data;
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
    let dataBucketSet: DataBucketSet = {};
    let messageDataSet: MessageDataSet = {};

    let dataEUIs: string[] = [];

    messageData.forEach((message) => {
      // Add data bucket set
      if (dataBucketSet[message.timestamp]) {
        dataBucketSet[message.timestamp].dataSets[message.deviceEUI] = [message];
      } else {
        dataBucketSet[message.timestamp] = {
          label: message.timestamp,
          dataSets: {}
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
      dataEUIs: dataEUIs
    };
  }
}
