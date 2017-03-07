import { autoinject } from 'aurelia-framework';
import { UserProfile } from 'Models/UserProfile';
import { AuthService } from 'Services/AuthService';
import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('UserInformation');

@autoinject
export class UserInformation {
  userProfile: UserProfile = {
    connectId: '',
    locale: 'en',
    name: 'Name placeholder',
    email: 'example@email.com',
    verifiedEmail: true,
    phone: '99999999',
    verifiedPhone: false
  };

  constructor(
    private authService: AuthService
  ) { }

  fetchUserProfile(): Promise<UserProfile> {
    if (this.userProfile) {
      return Promise.resolve(this.userProfile);
    }

    return this.authService.getUserProfile().then(userProfile => {
      this.userProfile = userProfile;
      return this.userProfile;
    }).catch(err => {
      delete this.userProfile;
      throw err;
    });
  }
}
