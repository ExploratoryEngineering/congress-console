import { Application } from 'Models/Application';
import { HttpClient } from 'aurelia-http-client';

import { NetworkInformation } from 'Helpers/NetworkInformation';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Application service');

export class ApplicationService {
  static inject = [HttpClient];

  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  fetchApplications(): Promise<Application[]> {
    return this.httpClient.get(`/api/networks/${NetworkInformation.selectedNetwork}/applications`)
      .then(data => data.content.applications)
      .then(content => {
        return content.map(Application.newFromDto);
      });
  }

  fetchApplicationByEUI(applicationEui: String): Promise<Application> {
    return this.httpClient.get(`/api/networks/${NetworkInformation.selectedNetwork}/applications/${applicationEui}`)
      .then(application => {
        Log.debug('ApplicationService: Fetching application', application);
        return Application.newFromDto(application);
      });
  }

  createNewApplication(application: Application): Promise<Application> {
    return this.httpClient.post(
      `/api/networks/${NetworkInformation.selectedNetwork}/applications`,
      Application.toDto(application)
    ).then(res => {
      Log.debug('Create success', res);
      return Application.newFromDto(res);
    });
  }

  updateApplication(application: Application): Promise<Application> {
    return this.httpClient.put(
      `/api/networks/${NetworkInformation.selectedNetwork}/applications/${application.appEUI}`,
      Application.toDto(application)
    ).then(res => {
      Log.debug('Update success', res);
      return Application.newFromDto(res);
    });
  }

  deleteApplication(application: Application): Promise<void> {
    return this.httpClient.delete(
      `/api/networks/${NetworkInformation.selectedNetwork}/applications/${application.appEUI}`
    ).then(res => {
      Log.debug('Delete success!', res);
    });
  }


}
