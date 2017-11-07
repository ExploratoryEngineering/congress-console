import { AureliaConfiguration } from "aurelia-configuration";
import { autoinject } from "aurelia-framework";

import { ResponseHandler } from "Helpers/ResponseHandler";

import { LogBuilder } from "./LogBuilder";
const Log = LogBuilder.create("Http client config");

@autoinject
export class HttpClientConfiguration {
  constructor(
    private responseHandler: ResponseHandler,
    private config: AureliaConfiguration,
  ) { }

  apiEndpointConfiguration() {
    return (client) => {
      client.withBaseUrl(this.config.get("api.endpoint"));
      client.withCredentials(true);
      client.withInterceptor({
        responseError: (responseError) => {
          const customError = this.responseHandler.handleResponse(responseError);

          Log.debug("In responseError", responseError, customError);
          if (customError) {
            throw customError;
          }
        },
      });
    };
  }
}
