import { autoinject } from 'aurelia-framework';

import { ApiClient } from 'Helpers/ApiClient';
import { Application } from 'Models/Application';
import { NetworkInformation } from 'Helpers/NetworkInformation';

import { LogBuilder } from 'Helpers/LogBuilder';
import { Time } from 'Helpers/Time';

const Log = LogBuilder.create('Application service');

@autoinject
export class ApplicationService {
  constructor(
    private apiClient: ApiClient,
    private networkInformation: NetworkInformation
  ) { }

  async fetchApplications(): Promise<Application[]> {
    const { netEui } = await this.networkInformation.fetchSelectedNetwork();

    return this.apiClient.http.get(`/networks/${netEui}/applications`)
      .then(data => data.content.applications)
      .then(applications => {
        return applications.map(Application.newFromDto);
      });
  }

  async fetchApplicationByEUI(applicationEui: string): Promise<Application> {
    const { netEui } = await this.networkInformation.fetchSelectedNetwork();

    return this.apiClient.http.get(`/networks/${netEui}/applications/${applicationEui}`)
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
    const { netEui } = await this.networkInformation.fetchSelectedNetwork();

    return this.apiClient.http.get(
      `/networks/${netEui}/applications/${applicationEui}/data?limit=${limit}&since=${since}`
    )
      .then(data => data.content.Messages)
      .then(messages => messages.reverse());
  }

  async createNewApplication(application: Application): Promise<Application> {
    const { netEui } = await this.networkInformation.fetchSelectedNetwork();

    return this.apiClient.http.post(
      `/networks/${netEui}/applications`,
      Application.toDto(application)
    ).then(data => data.content)
      .then(res => {
        Log.debug('Create success', res);
        return Application.newFromDto(res);
      });
  }

  async updateApplication(application: Application): Promise<Application> {
    const { netEui } = await this.networkInformation.fetchSelectedNetwork();

    return this.apiClient.http.put(
      `/networks/${netEui}/applications/${application.appEUI}`,
      Application.toDto(application)
    ).then(data => data.content)
      .then(res => {
        Log.debug('Update success', res);
        return Application.newFromDto(res);
      });
  }

  async deleteApplication(application: Application): Promise<void> {
    const { netEui } = await this.networkInformation.fetchSelectedNetwork();

    return this.apiClient.http.delete(
      `/networks/${netEui}/applications/${application.appEUI}`
    ).then(res => {
      Log.debug('Delete success!', res);
    });
  }
}
