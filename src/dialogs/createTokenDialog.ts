import { DialogController } from 'aurelia-dialog';
import { autoinject } from 'aurelia-framework';

import { TokenService } from 'Services/TokenService';

import { Application } from 'Models/Application';
import { Token } from 'Models/Token';

const AccessLevels = {
  readonly: false,
  fullaccess: true
};

@autoinject
export class CreateTokenDialog {
  token: Token;
  application: Application;

  selectedAccessLevel: string = 'readonly';

  constructor(
    private dialogController: DialogController,
    private tokenService: TokenService
  ) {
    this.token = new Token({
      write: false
    });
  }

  async createToken() {
    this.token.resource = await this.tokenService.resourcePathForApplication(this.application.appEUI);
    this.token.write = AccessLevels[this.selectedAccessLevel];

    this.tokenService.createToken(this.token).then(token => {
      this.dialogController.ok(token);
    });
  }

  activate(args) {
    this.application = args.application;
  }
}
