import { LogBuilder } from './LogBuilder';
import { autoinject } from 'aurelia-framework';
import { ResponseHandler } from 'Helpers/ResponseHandler';

const Log = LogBuilder.create('Http client config');

@autoinject
export class HttpClientConfiguration {
  constructor(
    private responseHandler: ResponseHandler
  ) { }

  apiEndpointConfiguration() {
    return (client) => {
      Log.info('Init httpClientConfig');
      client.withBaseUrl('http://localhost:8080');
      client.withCredentials(true);
      client.withInterceptor({
        responseError: (responseError) => {
          let customError = this.responseHandler.handleResponse(responseError);

          Log.debug('In responseError', responseError, customError);
          if (customError) {
            throw customError;
          }
        }
      });
    };
  }
}
