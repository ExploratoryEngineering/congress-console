interface OutputConfig {
  type: string;
  endpoint: string;
  port: number;
  username: string;
  password: string;
  certCheck: boolean;
}

interface OuputConfigDto {
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
  config: OuputConfigDto;
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
      certCheck: true
    },
    logs = [],
    status = ''
  }: Output) {
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
      config: {
        type: output.config.type,
        endpoint: output.config.endpoint,
        port: output.config.port,
        username: output.config.username,
        password: output.config.password,
        certCheck: output.config.cert_check
      },
      logs: output.logs,
      status: output.status
    });
  }

  static toDto(output: Output): OutputDto {
    return {
      eui: output.eui,
      queued: output.queued,
      type: output.type,
      config: {
        type: output.config.type,
        endpoint: output.config.endpoint,
        port: output.config.port,
        username: output.config.username,
        password: output.config.password,
        cert_check: output.config.certCheck
      },
      logs: output.logs,
      status: output.status
    };
  }
}
