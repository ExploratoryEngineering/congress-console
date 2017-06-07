import { UserInformation } from 'Helpers/UserInformation';
import { UserProfile } from 'Models/UserProfile';

class AuthServiceMock {
  getUserProfile() {
    return Promise.resolve(new UserProfile());
  }
}

class GravatarServiceMock {
  getImageSrcByEmail() { }
}

describe('The UserInformation helper', () => {
  let mockedAuthService;
  let mockedGravatarService;
  let userInformation;

  beforeEach(() => {
    mockedAuthService = new AuthServiceMock();
    mockedGravatarService = new GravatarServiceMock();
    userInformation = new UserInformation(mockedAuthService, mockedGravatarService);
  });

  it('should reject the fetch user profile call if not logged in', (done) => {
    delete userInformation.userProfile;

    mockedAuthService.getUserProfile = () => {
      return Promise.reject(new Error('Not logged in'));
    };
    userInformation.fetchUserProfile().catch(() => {
      done();
    });
  });

  it('should return a user profile object on logged in', (done) => {
    userInformation.fetchUserProfile().then(profile => {
      expect(profile).toBeTruthy();
      done();
    });
  });
});
