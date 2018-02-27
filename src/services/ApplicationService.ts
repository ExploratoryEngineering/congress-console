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

import { ApiClient } from "Helpers/ApiClient";
import { Application } from "Models/Application";

import { LogBuilder } from "Helpers/LogBuilder";
import { Time } from "Helpers/Time";

const Log = LogBuilder.create("Application service");

interface ApplicationStats {
  messagesIn: number[];
  messagesOut: number[];
}

@autoinject
export class ApplicationService {
  constructor(
    private apiClient: ApiClient,
  ) { }

  async fetchApplications(): Promise<Application[]> {
    return this.apiClient.http.get(`/applications`)
      .then((data) => data.content.applications)
      .then((applications) => {
        return applications.map(Application.newFromDto);
      });
  }

  async fetchApplicationByEUI(applicationEui: string): Promise<Application> {
    return this.apiClient.http.get(`/applications/${applicationEui}`)
      .then((data) => data.content)
      .then((application) => {
        Log.debug("Fetching application", application);
        return Application.newFromDto(application);
      });
  }

  async fetchApplicationStatsByEUI(applicationEui: string): Promise<ApplicationStats> {
    return this.apiClient.http.get(`/applications/${applicationEui}/stats`)
      .then((data) => JSON.parse(data.content));
  }

  async fetchApplicationDataByEUI(
    applicationEui: string,
    {
      limit = 100,
      since = Time.SIX_HOURS_AGO.format("x"),
    }: DataSearchParameters = {}): Promise<MessageData[]> {
    return this.apiClient.http.get(
      `/applications/${applicationEui}/data?limit=${limit}&since=${since}`,
    )
      .then((data) => data.content.messages)
      .then((messages) => messages.reverse());
  }

  async createNewApplication(application: Application): Promise<Application> {
    return this.apiClient.http.post(
      `/applications`,
      Application.toDto(application),
    ).then((data) => data.content)
      .then((res) => {
        Log.debug("Create success", res);
        return Application.newFromDto(res);
      });
  }

  async updateApplication(application: Application): Promise<Application> {
    return this.apiClient.http.put(
      `/applications/${application.appEUI}`,
      Application.toDto(application),
    ).then((data) => data.content)
      .then((res) => {
        Log.debug("Update success", res);
        return Application.newFromDto(res);
      });
  }

  async deleteApplication(application: Application): Promise<void> {
    return this.apiClient.http.delete(
      `/applications/${application.appEUI}`,
    ).then((res) => {
      Log.debug("Delete success!", res);
    });
  }
}
