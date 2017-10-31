import { DialogController } from 'aurelia-dialog';
import { autoinject } from 'aurelia-framework';

import { TokenService } from 'Services/TokenService';

import { Application } from 'Models/Application';
import { Gateway } from 'Models/Gateway';
import { Token } from 'Models/Token';

const AccessLevels = {
  readonly: false,
  fullaccess: true
};

@autoinject
export class CreateTokenDialog {
  token: Token;

  selectedAccessLevel: string = 'readonly';
  selectedResourceAccess: string = 'all';
  selectedApplication: string;
  selectedGateway: string;

  applications: Application[] = [];
  gateways: Gateway[] = [];

  constructor(
    private dialogController: DialogController,
    private tokenService: TokenService
  ) {
    this.token = new Token({
      write: false
    });
  }

  createToken() {
    this.token.write = AccessLevels[this.selectedAccessLevel];
    this.token.resource = this.getResourceAccessUrl();

    this.tokenService.createToken(this.token).then(token => {
      this.dialogController.ok(token);
    });
  }

  cancel() {
    this.dialogController.cancel();
  }

  getResourceAccessUrl(): string {
    const resourceAccess = this.selectedResourceAccess;

    if (resourceAccess === 'all') {
      return '/';
    } else {
      if (resourceAccess === 'applications' || resourceAccess === 'gateways') {
        return `/${resourceAccess}`;
      }

      if (resourceAccess === 'specific_application') {
        return `/applications/${this.selectedApplication}`;
      } else if (resourceAccess === 'specific_gateway') {
        return `/gateways/${this.selectedGateway}`;
      }
    }
  }

  activate(args) {
    this.applications = args.applications;
    this.gateways = args.gateways;
  }
}
