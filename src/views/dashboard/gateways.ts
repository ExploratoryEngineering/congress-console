import { autoinject, PLATFORM } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';

import { GatewayService } from 'Services/GatewayService';
import { Gateway } from 'Models/Gateway';

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
    this.dialogService.open({
      viewModel: PLATFORM.moduleName('dialogs/createGatewayDialog')
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        this.eventAggregator.publish('global:message', {
          body: 'Gateway created'
        });
        this.gateways.push(response.output);
      }
    });
  }

  editGateway(gateway) {
    let gatewayUntouched = { ...gateway };
    Log.debug('Editing gateway', gateway);

    this.dialogService.open({
      viewModel: PLATFORM.moduleName('dialogs/editGatewayDialog'),
      model: {
        gateway: gatewayUntouched
      }
    }).whenClosed(response => {
      Log.debug('Edit application', response);
      if (!response.wasCancelled) {
        this.eventAggregator.publish('global:message', {
          body: 'Gateway updated'
        });
        this.fetchAndPopulateGateways();
      }
    });
  }

  deleteGateway(gateway: Gateway) {
    Log.debug('Deleting gateway', gateway);
    this.dialogService.open({
      viewModel: PLATFORM.moduleName('dialogs/messageDialog'),
      model: {
        messageHeader: `Delete gateway?`,
        message: `Are you sure you want to delete gateway with EUI ${gateway.gatewayEUI}. This can NOT be reversed.`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        Log.debug('Deleting gateway');
        this.gatewayService.deleteGateway(gateway).then(() => {
          this.eventAggregator.publish('global:message', {
            body: 'Gateway deleted'
          });
          this.gateways = this.gateways.filter(gw => gw.gatewayEUI !== gateway.gatewayEUI);
        });
      } else {
        Log.debug('Did not delete gateway');
      }
    });
  }

  showEventLogForGateway(gateway: Gateway) {
    this.dialogService.open({
      viewModel: PLATFORM.moduleName('dialogs/eventLogDialog'),
      model: {
        eventLogStreamEndpoint: `/gateways/${gateway.gatewayEUI}/stream`
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
    this.subscriptions.push(this.eventAggregator.subscribe('gateway:eventLog', (gateway) => {
      this.showEventLogForGateway(gateway);
    }));

    return this.fetchAndPopulateGateways();
  }

  deactivate() {
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.subscriptions = [];
  }
}
