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
import { HttpClient } from "aurelia-http-client";
import { HttpClientConfiguration } from "Helpers/HttpClientConfiguration";
import { LogBuilder } from "Helpers/LogBuilder";
import { Time } from "Helpers/Time";
import { Application } from "Models/Application";
import { Device } from "Models/Device";

export * from "Models/Application";
export * from "Models/Device";

const Log = LogBuilder.create("Share service");

@autoinject
export class ShareService {
  httpClient = new HttpClient();

  applications: Application[] = [];

  constructor(
    private httpClientConfig: HttpClientConfiguration,
  ) {
    this.httpClient.configure(this.httpClientConfig.tokenEndpointConfiguration());
  }

  setAPIToken(token: string) {
    this.httpClient.configure((builder) => {
      builder.withHeader("X-API-Token", token);
    });
  }

  async fetchApplicationsWithToken(): Promise<Application[]> {
    return this.httpClient.get("/applications")
      .then((data) => data.content.applications)
      .then((applications) => {
        Log.debug("app", applications);
        return applications.map(Application.newFromDto);
      });
  }

  async fetchApplicationWithToken(appeui: string): Promise<Application> {
    return this.httpClient.get(`/applications/${appeui}`)
      .then((data) => data.content)
      .then((application) => {
        return Application.newFromDto(application);
      });
  }

  async fetchApplicationDevicesWithToken(appeui: string): Promise<Device[]> {
    return this.httpClient.get(`/applications/${appeui}/devices`)
      .then((data) => data.content.devices)
      .then((devices) => {
        return devices.map(Device.newFromDto);
      });
  }

  async fetchApplicationDataByEUI(
    applicationEui: string,
    {
      limit = 100,
      since = Time.SIX_HOURS_AGO.format("x"),
    }: DataSearchParameters = {}): Promise<MessageData[]> {
    return this.httpClient.get(
      `/applications/${applicationEui}/data?limit=${limit}&since=${since}`,
    )
      .then((data) => data.content.messages)
      .then((messages) => messages.reverse());
  }
}
