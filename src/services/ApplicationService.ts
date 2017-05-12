import { autoinject } from 'aurelia-framework';

import { ApiClient } from 'Helpers/ApiClient';
import { Application } from 'Models/Application';

import { LogBuilder } from 'Helpers/LogBuilder';
import { Time } from 'Helpers/Time';

const Log = LogBuilder.create('Application service');

@autoinject
export class ApplicationService {
  constructor(
    private apiClient: ApiClient
  ) { }

  async fetchApplications(): Promise<Application[]> {
    return this.apiClient.http.get(`/applications`)
      .then(data => data.content.applications)
      .then(applications => {
        return applications.map(Application.newFromDto);
      });
  }

  async fetchApplicationByEUI(applicationEui: string): Promise<Application> {
    return this.apiClient.http.get(`/applications/${applicationEui}`)
      .then(data => data.content)
      .then(application => {
        Log.debug('Fetching application', application);
        return Application.newFromDto(application);
      });
  }

  async fetchApplicationDataByEUI(
    applicationEui: string,
    {
      limit = 100,
      since = Time.SIX_HOURS_AGO.format('X')
    }: DataSearchParameters = {}): Promise<MessageData[]> {
    return this.apiClient.http.get(
      `/applications/${applicationEui}/data?limit=${limit}&since=${since}`
    )
      .then(data => data.content.Messages)
      .then(messages => messages.reverse());
  }

  async createNewApplication(application: Application): Promise<Application> {
    return this.apiClient.http.post(
      `/applications`,
      Application.toDto(application)
    ).then(data => data.content)
      .then(res => {
        Log.debug('Create success', res);
        return Application.newFromDto(res);
      });
  }

  async updateApplication(application: Application): Promise<Application> {
    return this.apiClient.http.put(
      `/applications/${application.appEUI}`,
      Application.toDto(application)
    ).then(data => data.content)
      .then(res => {
        Log.debug('Update success', res);
        return Application.newFromDto(res);
      });
  }

  async deleteApplication(application: Application): Promise<void> {
    return this.apiClient.http.delete(
      `/applications/${application.appEUI}`
    ).then(res => {
      Log.debug('Delete success!', res);
    });
  }
}
