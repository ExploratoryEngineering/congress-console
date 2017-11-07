import { autoinject } from "aurelia-framework";
import { LogBuilder } from "Helpers/LogBuilder";
import { UserProfile } from "Models/UserProfile";
import { AuthService } from "Services/AuthService";
import { GravatarService } from "Services/GravatarService";

const Log = LogBuilder.create("UserInformation");

@autoinject
export class UserInformation {
  userProfile: UserProfile;
  gravatarSrc: string;

  constructor(
    private authService: AuthService,
    private gravatarService: GravatarService,
  ) { }

  fetchUserProfile(): Promise<UserProfile> {
    if (this.userProfile) {
      return Promise.resolve(this.userProfile);
    }

    Log.debug("Fetching user information");

    return this.authService.getUserProfile().then((userProfile) => {
      this.userProfile = userProfile;
      this.gravatarSrc = this.gravatarService.getImageSrcByEmail(userProfile.email);
      return this.userProfile;
    });
  }
}
