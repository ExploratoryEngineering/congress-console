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
