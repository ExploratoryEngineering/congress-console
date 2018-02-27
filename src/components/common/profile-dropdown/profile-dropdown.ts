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

import { AureliaConfiguration } from "aurelia-configuration";
import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { UserInformation } from "Helpers/UserInformation";

@autoinject
export class ProfileDropdown {
  userInformation: UserInformation;
  myPageUrl: string;

  constructor(
    private router: Router,
    private config: AureliaConfiguration,
    userInformation: UserInformation,
  ) {
    this.userInformation = userInformation;
    this.myPageUrl = this.config.get("myConnectUrl");
  }

  logOutHref(): string {
    return `${this.config.get("api.endpoint")}/connect/logout`;
  }
}
