import { autoinject } from "aurelia-framework";
import { HttpClient } from "aurelia-http-client";
import { HttpClientConfiguration } from "Helpers/HttpClientConfiguration";

@autoinject
export class ApiClient {
  http: HttpClient;

  constructor(
    http: HttpClient,
    private httpClientConfig: HttpClientConfiguration,
  ) {
    this.http = http;
    http.configure(httpClientConfig.apiEndpointConfiguration());
  }
}
