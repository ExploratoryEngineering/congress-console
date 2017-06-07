import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { TokenService } from 'Services/TokenService';
import { ApplicationService } from 'Services/ApplicationService';

import { Application } from 'Models/Application';
import { Token } from 'Models/Token';

import { MessageDialog } from 'Dialogs/messageDialog';
import { CreateTokenDialog } from 'Dialogs/createTokenDialog';

import { LogBuilder } from 'Helpers/LogBuilder';
const Log = LogBuilder.create('Application devices');

@autoinject
export class ServiceDetails {
  application: Application = new Application();
  allApplications: Application[] = [];
  selectableApplications: Application[] = [];

  tokens: Token[];
  subscriptions: any[] = [];

  constructor(
    private applicationService: ApplicationService,
    private tokenService: TokenService,
    private eventAggregator: EventAggregator,
    private dialogService: DialogService,
    private router: Router
  ) { }

  createNewToken() {
    Log.debug('Creating token');

    this.dialogService.open({
      viewModel: CreateTokenDialog,
      model: { application: this.application }
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        Log.debug('Data from created token', response);
        this.tokens.push(response.output);
      }
    });
  }

  deleteToken(tokenToBeDeleted: Token) {
    Log.debug('Received delete request for token', tokenToBeDeleted);

    this.dialogService.open({
      viewModel: MessageDialog,
      model: {
        messageHeader: 'Delete token?',
        message: `Are you sure you want to delete the application token? (THIS CAN NOT BE REVERTED)`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        Log.debug('Deleting device');
        this.tokenService.deleteToken(tokenToBeDeleted).then(() => {
          this.tokens = this.tokens.filter(token => {
            return token.token !== tokenToBeDeleted.token;
          });
        });
      } else {
        Log.debug('Did not delete token');
      }
    });
  }

  activate(args) {
    this.subscriptions.push(this.eventAggregator.subscribe('token:delete', token => {
      this.deleteToken(token);
    }));

    return Promise.all([
      this.applicationService.fetchApplications().then((applications) => {
        this.allApplications = applications;

        let selectedApplication = this.allApplications.find((application) => {
          return application.appEUI === args.applicationId;
        });

        if (selectedApplication) {
          this.application = selectedApplication;
        } else {
          return;
        }

        this.selectableApplications = this.allApplications.filter((application) => {
          return application.appEUI !== this.application.appEUI;
        });
      }),
      this.tokenService.fetchTokensForApplication(args.applicationId)
        .then(tokens => {
          this.tokens = tokens;
        })
    ]).catch(err => {
      Log.error(err);
      this.router.navigate('');
    });
  }

  deactivate() {
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.subscriptions = [];
  }
}
