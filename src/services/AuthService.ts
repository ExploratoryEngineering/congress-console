import { autoinject } from "aurelia-framework";
import { ApiClient } from "Helpers/ApiClient";
import { UserProfile } from "Models/UserProfile";

@autoinject
export class AuthService {
  constructor(
    private apiClient: ApiClient,
  ) { }

  getUserProfile(): Promise<UserProfile> {
    return this.apiClient.http.get("/connect/profile")
      .then((data) => UserProfile.newFromDto(JSON.parse(data.content)));
  }
}
