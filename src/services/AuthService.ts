import { ApiClient } from 'Helpers/ApiClient';
import { UserProfile } from 'Models/UserProfile';
import { autoinject } from 'aurelia-framework';

@autoinject
export class AuthService {
  constructor(
    private apiClient: ApiClient
  ) { }

  getUserProfile(): Promise<UserProfile> {
    return this.apiClient.http.get('http://lora.localhost/api/connect/profile')
      .then(data => UserProfile.newFromDto(data.content));
  }
}
