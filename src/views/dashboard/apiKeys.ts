import { DialogService } from "aurelia-dialog";
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, PLATFORM } from "aurelia-framework";
import { Router } from "aurelia-router";

import { ApplicationService } from "Services/ApplicationService";
import { GatewayService } from "Services/GatewayService";
import { TokenService } from "Services/TokenService";

import { Application } from "Models/Application";
import { Gateway } from "Models/Gateway";
import { Token } from "Models/Token";

import { LogBuilder } from "Helpers/LogBuilder";
const Log = LogBuilder.create("Application devices");

@autoinject
export class ApiKeys {
  applications: Application[] = [];
  gateways: Gateway[] = [];
  tokens: Token[] = [];
  subscriptions: any[] = [];

  constructor(
    private tokenService: TokenService,
    private applicationService: ApplicationService,
    private gatewayService: GatewayService,
    private dialogService: DialogService,
    private eventAggregator: EventAggregator,
    private router: Router,
  ) { }

  createNewToken() {
    Log.debug("Creating token");

    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/createTokenDialog"),
      model: {
        applications: this.applications,
        gateways: this.gateways,
      },
    }).whenClosed((response) => {
      if (!response.wasCancelled) {
        Log.debug("Data from created token", response);
        this.tokens.push(response.output);
        this.eventAggregator.publish("global:message", {
          body: "Token created",
        });
      }
    });
  }

  deleteToken(tokenToBeDeleted: Token) {
    Log.debug("Received delete request for token", tokenToBeDeleted);

    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/messageDialog"),
      model: {
        messageHeader: "Delete token?",
        message: `Are you sure you want to delete the application token? (THIS CAN NOT BE REVERTED)`,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      },
    }).whenClosed((response) => {
      if (!response.wasCancelled) {
        Log.debug("Deleting token");
        this.tokenService.deleteToken(tokenToBeDeleted).then(() => {
          this.tokens = this.tokens.filter((token) => {
            return token.token !== tokenToBeDeleted.token;
          });
        });
      } else {
        Log.debug("Did not delete token");
      }
    });
  }

  editToken(tokenToEdit: Token) {
    Log.debug("Received edit request for token", tokenToEdit);
    const tokenUntouched = { ...tokenToEdit };

    this.dialogService.open({
      viewModel: PLATFORM.moduleName("dialogs/editTokenDialog"),
      model: {
        applications: this.applications,
        gateways: this.gateways,
        token: tokenUntouched,
      },
    }).whenClosed((response) => {
      if (!response.wasCancelled) {
        const updatedToken = response.output;
        Log.debug("Updating token");
        const index = this.tokens.findIndex((token) => {
          return token.token !== updatedToken.token;
        });
        this.tokens.splice(index, 1, updatedToken);
      } else {
        Log.debug("Did not update token");
      }
    });
  }

  activate(args) {
    this.subscriptions.push(this.eventAggregator.subscribe("token:edit", (token) => {
      this.editToken(token);
    }));

    this.subscriptions.push(this.eventAggregator.subscribe("token:delete", (token) => {
      this.deleteToken(token);
    }));

    return Promise.all([
      this.tokenService.fetchTokens()
        .then((tokens) => {
          this.tokens = tokens;
        }),
      this.applicationService.fetchApplications().then((applications) => {
        this.applications = applications;
      }),
      this.gatewayService.fetchPersonalGateways().then((gateways) => {
        this.gateways = gateways;
      }),
    ]).catch((err) => {
      Log.error(err);
      this.router.navigate("");
    });
  }

  deactivate() {
    this.subscriptions.forEach((subscription) => subscription.dispose());
    this.subscriptions = [];
  }
}
