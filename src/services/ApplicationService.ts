import { Application } from 'Models/Application';
import { HttpClient } from 'aurelia-http-client';

import { NetworkInformation } from 'Helpers/NetworkInformation';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Application service');

export class ApplicationService {
  static inject = [HttpClient, NetworkInformation];

  httpClient: HttpClient;
  networkInformation: NetworkInformation;

  constructor(httpClient: HttpClient, networkInformation: NetworkInformation) {
    this.httpClient = httpClient;
    this.networkInformation = networkInformation;
  }

  fetchApplications(): Promise<Application[]> {
    return this.httpClient.get(`/api/networks/${this.networkInformation.selectedNetwork.netEui}/applications`)
      .then(data => data.content.applications)
      .then(content => {
        return content.map(Application.newFromDto);
      });
  }

  fetchApplicationByEUI(applicationEui: String): Promise<Application> {
    return this.httpClient.get(`/api/networks/${this.networkInformation.selectedNetwork.netEui}/applications/${applicationEui}`)
      .then(application => {
        Log.debug('ApplicationService: Fetching application', application);
        return Application.newFromDto(application);
      });
  }

  createNewApplication(application: Application): Promise<Application> {
    return this.httpClient.post(
      `/api/networks/${this.networkInformation.selectedNetwork.netEui}/applications`,
      Application.toDto(application)
    ).then(res => {
      Log.debug('Create success', res);
      return Application.newFromDto(res);
    });
  }

  updateApplication(application: Application): Promise<Application> {
    return this.httpClient.put(
      `/api/networks/${this.networkInformation.selectedNetwork.netEui}/applications/${application.appEUI}`,
      Application.toDto(application)
    ).then(res => {
      Log.debug('Update success', res);
      return Application.newFromDto(res);
    });
  }

  deleteApplication(application: Application): Promise<void> {
    return this.httpClient.delete(
      `/api/networks/${this.networkInformation.selectedNetwork.netEui}/applications/${application.appEUI}`
    ).then(res => {
      Log.debug('Delete success!', res);
    });
  }


}
