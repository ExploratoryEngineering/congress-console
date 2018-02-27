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

interface OutputConfig {
  type: string;
  endpoint: string;
}

export interface AwsIotConfig extends OutputConfig {
  type: "awsiot";
  clientCertificate: string;
  privateKey: string;
  clientId: string;
}

export interface MqttOutputConfig extends OutputConfig {
  type: "mqtt";
  port: number;
  username: string;
  password: string;
  tls: boolean;
  certCheck: boolean;
}

interface OutputConfigDto {
  type: string;
  endpoint: string;
}

interface AwsIotConfigDto extends OutputConfigDto {
  type: "awsiot";
  clientCertificate: string;
  privateKey: string;
  clientId: string;
}

interface MqttOutputConfigDto extends OutputConfig {
  type: "mqtt";
  port: number;
  username: string;
  password: string;
  tls: boolean;
  cert_check: boolean;
}

interface OutputDto {
  eui: string;
  queued: number;
  config: AwsIotConfigDto | MqttOutputConfigDto;
  logs: LogEntry[];
  status: string;
}

interface LogEntry {
  timestamp: string;
  message: string;
}

interface OutputParameters {
  eui?: string;
  queued?: number;
  config?: AwsIotConfig | MqttOutputConfig;
  logs?: LogEntry[];
  status?: string;
}

export class Output {
  static newFromDto(output: OutputDto): Output {
    function getOutputConfigFromDto(outputConfig: AwsIotConfigDto | MqttOutputConfigDto): AwsIotConfig | MqttOutputConfig {
      if (outputConfig.type === "mqtt") {
        return {
          type: outputConfig.type,
          endpoint: outputConfig.endpoint,
          port: outputConfig.port,
          username: outputConfig.username,
          password: outputConfig.password,
          tls: outputConfig.tls,
          certCheck: outputConfig.cert_check,
        };
      } else if (outputConfig.type === "awsiot") {
        return {
          type: outputConfig.type,
          endpoint: outputConfig.endpoint,
          clientCertificate: outputConfig.clientCertificate,
          privateKey: outputConfig.privateKey,
          clientId: outputConfig.clientId,
        };
      }
    }

    return new Output({
      eui: output.eui,
      queued: output.queued,
      config: getOutputConfigFromDto(output.config),
      logs: output.logs,
      status: output.status,
    });
  }

  static toDto(output: Output): OutputDto {
    function getOutConfigToDto(outputConfig: AwsIotConfig | MqttOutputConfig): AwsIotConfigDto | MqttOutputConfigDto {
      if (outputConfig.type === "mqtt") {
        return {
          type: outputConfig.type,
          endpoint: outputConfig.endpoint,
          port: outputConfig.port,
          username: outputConfig.username,
          password: outputConfig.password,
          tls: outputConfig.tls,
          cert_check: outputConfig.certCheck,
        };
      } else if (outputConfig.type === "awsiot") {
        return {
          type: outputConfig.type,
          endpoint: outputConfig.endpoint,
          clientCertificate: outputConfig.clientCertificate,
          privateKey: outputConfig.privateKey,
          clientId: outputConfig.clientId,
        };
      }
    }

    return {
      eui: output.eui,
      queued: output.queued,
      config: getOutConfigToDto(output.config),
      logs: output.logs,
      status: output.status,
    };
  }

  eui: string;
  queued: number;
  config: AwsIotConfig | MqttOutputConfig;
  logs: LogEntry[];
  status: string;

  constructor({
    eui = "",
    queued = 0,
    config = {
      type: "mqtt",
      endpoint: "",
      port: 1883,
      username: "",
      password: "",
      tls: true,
      certCheck: true,
    },
    logs = [],
    status = "",
  }: OutputParameters) {
    this.eui = eui;
    this.queued = queued;
    this.config = config;
    this.logs = logs;
    this.status = status;
  }
}
