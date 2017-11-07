import { UserProfile } from "Models/UserProfile";

export class UserInformationMock {
  fetchUserProfile() {
    return Promise.resolve(new UserProfile());
  }
}
