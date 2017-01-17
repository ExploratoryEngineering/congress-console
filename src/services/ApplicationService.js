import { Application } from 'Models/Application';
import { HttpClient } from 'aurelia-http-client';

import NetworkInformation from 'Helpers/NetworkInformation';

export class ApplicationService {
  static inject = [HttpClient];

  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  fetchApplications() {
    return this.httpClient.get(`/api/networks/${NetworkInformation.selectedNetwork}/applications`)
      .then(data => data.content.applications)
      .then(content => {
        return content.map(application => new Application(this.mapFromServer(application)));
      });
  }

  fetchApplicationByEUI(applicationEui) {
    return this.httpClient.get(`/api/networks/${NetworkInformation.selectedNetwork}/applications/${applicationEui}`)
      .then(application => {
        console.log('ApplicationService: Fetching application', application);
        return new Application(application);
      });
  }

  createNewApplication(application) {
    return this.httpClient.post(
      `/api/networks/${NetworkInformation.selectedNetwork}/applications`,
      this.mapToServer(application)
    ).then(res => {
      console.log('Success!', res);
    }).catch(err => {
      console.error(err);
    });
  }

  updateApplication(application) {
    return this.httpClient.put(
      `/api/networks/${NetworkInformation.selectedNetwork}/applications/${application.appEUI}`,
      this.mapToServer(application)
    ).then(res => {
      console.log('Success!', res);
    }).catch(err => {
      console.error(err);
    });
  }

  deleteApplication(application) {
    return this.httpClient.del(
      `/api/networks/${NetworkInformation.selectedNetwork}/applications/${application.appEUI}`
    ).then(res => {
      console.log('Success!', res);
    }).catch(err => {
      console.error(err);
    });
  }

  mapToServer(application) {
    return {
      AppEUI: application.appEUI,
      AppKey: application.appKey,
      Name: application.name,
      NetEUI: application.netEUI || NetworkInformation.selectedNetwork,
      OwnerId: application.ownerID
    };
  }

  mapFromServer(application) {
    return {
      appEUI: application.AppEUI,
      appKey: application.AppKey,
      name: application.Name,
      netEUI: application.NetEUI,
      ownerId: application.OwnerID
    };
  }
}
