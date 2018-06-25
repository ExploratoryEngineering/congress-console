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

import { autoinject } from "aurelia-framework";

import { ResponseHandler } from "Helpers/ResponseHandler";

import { RequestBuilder } from "aurelia-http-client";
import { LogBuilder } from "./LogBuilder";
const Log = LogBuilder.create("Http client config");

@autoinject
export class HttpClientConfiguration {
  constructor(
    private responseHandler: ResponseHandler,
  ) { }

  apiEndpointConfiguration(): ((builder: RequestBuilder) => void) {
    Log.debug("Creating api endpoint config");
    return (client) => {
      client
        .withBaseUrl(CONGRESS_ENDPOINT)
        .withCredentials(true)
        .withInterceptor({
          responseError: (responseError) => {
            const customError = this.responseHandler.handleResponse(responseError);

            Log.debug("In responseError", responseError, customError);
            if (customError) {
              throw customError;
            }

            return responseError;
          },
        });
    };
  }

  tokenEndpointConfiguration(): ((builder: RequestBuilder) => void) {
    Log.debug("Creating token endpoint config");
    return (client) => {
      client.withBaseUrl(CONGRESS_ENDPOINT)
        .withCredentials(true)
        .withInterceptor({
          responseError: (responseError) => {
            if (responseError.statusCode === 401) {
              Log.debug("401 in token endpoint config. Will not handle.", responseError);
              return Promise.reject(responseError);
            }

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
