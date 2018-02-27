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

import { UserInformation } from "Helpers/UserInformation";
import { UserProfile } from "Models/UserProfile";
import { GravatarServiceMock } from "Test/mock/mocks";

const TEST_EMAIL = "testemail@example.com";

class AuthServiceMock {
  getUserProfile() {
    return Promise.resolve(new UserProfile({
      email: TEST_EMAIL,
    }));
  }
}

describe("The UserInformation helper", () => {
  let mockedAuthService;
  let mockedGravatarService;
  let userInformation;

  beforeEach(() => {
    mockedAuthService = new AuthServiceMock();
    mockedGravatarService = new GravatarServiceMock();
    userInformation = new UserInformation(mockedAuthService, mockedGravatarService);
  });

  it("should reject the fetch user profile call if not logged in", (done) => {
    delete userInformation.userProfile;

    mockedAuthService.getUserProfile = () => {
      return Promise.reject(new Error("Not logged in"));
    };
    userInformation.fetchUserProfile().catch(() => {
      done();
    });
  });

  it("should return a user profile object on logged in", (done) => {
    userInformation.fetchUserProfile().then((profile) => {
      expect(profile).toBeTruthy();
      done();
    });
  });

  it("should generate a gravatar src based on email when loading new profile object", (done) => {
    const getImageSpy = spyOn(mockedGravatarService, "getImageSrcByEmail");

    userInformation.fetchUserProfile().then((profile) => {
      expect(getImageSpy).toHaveBeenCalledWith(TEST_EMAIL);
      done();
    });
  });
});
