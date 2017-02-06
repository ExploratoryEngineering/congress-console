import { UserInformation } from 'Helpers/UserInformation';

describe('The UserInformation helper', () => {
  beforeEach(() => {
    UserInformation.setLoggedIn(false);
  });

  it('should return false on logged in if user is not logged in', () => {
    expect(UserInformation.isLoggedIn()).toBe(false);
  });

  it('should return true on logged in if user is logged in', () => {
    UserInformation.setLoggedIn(true);

    expect(UserInformation.isLoggedIn()).toBe(true);
  });
});
