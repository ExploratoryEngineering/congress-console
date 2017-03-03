import { autoinject } from 'aurelia-framework';

import { ApiClient } from 'Helpers/ApiClient';
import { Application } from 'Models/Application';
import { NetworkInformation } from 'Helpers/NetworkInformation';

import * as moment from 'moment';

import { LogBuilder } from 'Helpers/LogBuilder';
const Log = LogBuilder.create('Application service');

@autoinject
export class ApplicationService {
  constructor(
    private apiClient: ApiClient,
    private networkInformation: NetworkInformation
  ) { }

  fetchApplications(): Promise<Application[]> {
    return this.apiClient.http.get(`/networks/${this.networkInformation.selectedNetwork.netEui}/applications`)
      .then(data => data.content.applications)
      .then(content => {
        return content.map(Application.newFromDto);
      });
  }

  fetchApplicationByEUI(applicationEui: string): Promise<Application> {
    return this.apiClient.http.get(`/networks/${this.networkInformation.selectedNetwork.netEui}/applications/${applicationEui}`)
      .then(data => data.content)
      .then(application => {
        Log.debug('Fetching application', application);
        return Application.newFromDto(application);
      });
  }

  fetchApplicationDataByEUI(
    applicationEui: string,
    {
      limit = 100,
      since = this.getDefaultSince()
    }: DataSearchParameters = {}): Promise<MessageData[]> {
    return this.apiClient.http.get(
      `/networks/${this.networkInformation.selectedNetwork.netEui}/applications/${applicationEui}/data?limit=${limit}&since=${since}`
    )
      .then(data => data.content.Messages)
      .then(data => data.reverse());
  }

  createNewApplication(application: Application): Promise<Application> {
    return this.apiClient.http.post(
      `/networks/${this.networkInformation.selectedNetwork.netEui}/applications`,
      Application.toDto(application)
    ).then(data => data.content)
      .then(res => {
        Log.debug('Create success', res);
        return Application.newFromDto(res);
      });
  }

  updateApplication(application: Application): Promise<Application> {
    return this.apiClient.http.put(
      `/networks/${this.networkInformation.selectedNetwork.netEui}/applications/${application.appEUI}`,
      Application.toDto(application)
    ).then(data => data.content)
      .then(res => {
        Log.debug('Update success', res);
        return Application.newFromDto(res);
      });
  }

  deleteApplication(application: Application): Promise<void> {
    return this.apiClient.http.delete(
      `/networks/${this.networkInformation.selectedNetwork.netEui}/applications/${application.appEUI}`
    ).then(res => {
      Log.debug('Delete success!', res);
    });
  }

  /**
   * Returns the default since to be used in data queries as UNIX timestamp
   */
  private getDefaultSince(): string {
    return moment().subtract(24, 'hours').format('X');
  }
}
