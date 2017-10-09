interface OutputConfig {
  type: string;
  endpoint: string;
  port: number;
  username: string;
  password: string;
  tls: boolean;
  certCheck: boolean;
}

interface OuputConfigDto {
  type: string;
  endpoint: string;
  port: number;
  username: string;
  password: string;
  tls: boolean;
  cert_check: boolean;
}

interface OutputDto {
  eui: string;
  queued: number;
  config: OuputConfigDto;
  logs: LogEntry[];
  status: string;
}

interface LogEntry {
  timestamp: string;
  message: string;
}


export class Output {
  eui: string;
  queued: number;
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
      tls: true,
      certCheck: true
    },
    logs = [],
    status = ''
  } = {}) {
    this.eui = eui;
    this.queued = queued;
    this.config = config;
    this.logs = logs;
    this.status = status;
  }

  static newFromDto(output: OutputDto): Output {
    return new Output({
      eui: output.eui,
      queued: output.queued,
      config: {
        type: output.config.type,
        endpoint: output.config.endpoint,
        port: output.config.port,
        username: output.config.username,
        password: output.config.password,
        tls: output.config.tls,
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
      config: {
        type: output.config.type,
        endpoint: output.config.endpoint,
        port: output.config.port,
        username: output.config.username,
        password: output.config.password,
        tls: output.config.tls,
        cert_check: output.config.certCheck
      },
      logs: output.logs,
      status: output.status
    };
  }
}
