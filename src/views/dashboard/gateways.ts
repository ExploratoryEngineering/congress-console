import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';

import { GatewayService } from 'Services/GatewayService';
import { Gateway } from 'Models/Gateway';

import { MessageDialog } from 'Dialogs/messageDialog';
import { CreateGatewayDialog } from 'Dialogs/createGatewayDialog';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Gateways');

@autoinject
export class Services {
  subscriptions: any = [];

  constructor(
    private gatewayService: GatewayService,
    private dialogService: DialogService,
    private router: Router,
    private eventAggregator: EventAggregator
  ) { }

  gateways: Gateway[] = [];

  createNewGateway() {
    Log.debug('Create new gateway');
    this.dialogService.open({ viewModel: CreateGatewayDialog }).then(response => {
      if (!response.wasCancelled) {
        this.gateways.push(response.output);
      }
    });
  }

  editGateway(gateway) {
    let gatewayUntouched = Object.assign({}, gateway);
  }

  deleteGateway(gateway: Gateway) {
    this.dialogService.open({
      viewModel: MessageDialog,
      model: {
        messageHeader: `Delete gateway ${gateway.gatewayEUI}?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    }).then(response => {
      if (!response.wasCancelled) {
        Log.debug('Deleting gateway');
        this.gatewayService.deleteGateway(gateway).then(() => {
          this.gateways = this.gateways.filter(gw => gw.gatewayEUI !== gateway.gatewayEUI);
        });
      } else {
        Log.debug('Did not delete gateway');
      }
    });
  }

  fetchAndPopulateGateways() {
    return new Promise((res) => {
      this.gatewayService.fetchGateways().then(gateways => {
        this.gateways = gateways;
        res();
      }).catch(err => {
        Log.error(err);
        res();
      });
    });
  }

  activate() {
    this.subscriptions.push(this.eventAggregator.subscribe('gateway:edit', (gateway) => {
      this.editGateway(gateway);
    }));
    this.subscriptions.push(this.eventAggregator.subscribe('gateway:delete', (gateway) => {
      this.deleteGateway(gateway);
    }));

    return this.fetchAndPopulateGateways();
  }

  deactivate() {
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.subscriptions = [];
  }
}
