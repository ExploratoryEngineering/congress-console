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
