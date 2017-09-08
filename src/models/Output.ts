interface OutputConfig {
  type: string;
  endpoint: string;
  port: number;
  username: string;
  password: string;
  cert_check: boolean;
}

interface OutputDto {
  eui: string;
  queued: number;
  type: string;
  config: OutputConfig;
  logs: LogEntry[];
  status: string;
}

interface LogEntry {
  time: string;
  message: string;
}


export class Output {
  eui: string;
  queued: number;
  type: string;
  config: OutputConfig;
  logs: LogEntry[];
  status: string;

  constructor({
    eui = '',
    queued = 0,
    type = '',
    config = {
      type: 'mqtt',
      endpoint: '',
      port: 1883,
      username: '',
      password: '',
      cert_check: true
    },
    logs = [],
    status = ''
  }: OutputDto) {
    this.eui = eui;
    this.queued = queued;
    this.type = type;
    this.config = config;
    this.logs = logs;
    this.status = status;
  }

  static newFromDto(output: OutputDto): Output {
    return new Output({
      eui: output.eui,
      queued: output.queued,
      type: output.type,
      config: output.config,
      logs: output.logs,
      status: output.status
    });
  }

  static toDto(output: Output): OutputDto {
    return {
      eui: output.eui,
      queued: output.queued,
      type: output.type,
      config: output.config,
      logs: output.logs,
      status: output.status
    };
  }
}
