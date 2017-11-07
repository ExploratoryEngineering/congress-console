import { LogBuilder } from "Helpers/LogBuilder";

type TransformationType = "count" | "CO2";

interface Transformation {
  type: TransformationType;
  data?: any;
}

const Log = LogBuilder.create("Data Transformer");

export class DataTransformer {
  transformCO2Message(message: MessageData): Transformation {
    return {
      type: "CO2",
      data: {
        sensorOne: parseInt(message.data.slice(0, 4), 16),
        sensorTwoStatus: parseInt(message.data.slice(4, 6), 16),
        sensorTwo: parseInt(message.data.slice(6, 10), 16),
      },
    };
  }
}
