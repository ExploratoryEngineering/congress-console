import { HttpClientConfiguration } from 'Helpers/HttpClientConfiguration';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

@autoinject
export class ApiClient {
  http: HttpClient;

  constructor(
    http: HttpClient,
    private httpClientConfig: HttpClientConfiguration
  ) {
    this.http = http;
    http.configure(httpClientConfig.apiEndpointConfiguration());
  }
}
