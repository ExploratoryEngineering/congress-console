import { Time } from 'Helpers/Time';
import { EventAggregator } from 'aurelia-event-aggregator';
import { LogBuilder } from 'Helpers/LogBuilder';
import { DeviceService } from 'Services/DeviceService';
import { Device } from 'Models/Device';
import { bindable, autoinject, containerless } from 'aurelia-framework';

import { DialogService } from 'aurelia-dialog';
import { ProvisionDeviceDialog } from 'Dialogs/provisionDeviceDialog';

const Log = LogBuilder.create('Device-expansion-panel');

@autoinject
@containerless
export class DeviceExpansionPanel {
  @bindable
  appeui: string;
  @bindable
  device: Device;
  @bindable
  active: boolean = false;

  subscriptions: any = [];
  lastDeviceData: MessageData;

  constructor(
    private deviceService: DeviceService,
    private dialogService: DialogService,
    private eventAggregator: EventAggregator
  ) { }

  bind() {
    this.subscriptions.push(this.eventAggregator.subscribe('deviceDataMessage', (messageData: MessageData) => {
      if (this.device.deviceEUI === messageData.deviceEUI) {
        Log.debug('Got messageData. Updating to be lastDeviceData', messageData);
        this.lastDeviceData = messageData;
      }
    }));
  }

  unbind() {
    this.subscriptions.forEach(subscription => subscription.dispose());
  }

  fetchLastMessageData() {
    return this.deviceService.fetchDeviceDataByEUI(
      this.appeui,
      this.device.deviceEUI,
      {
        limit: 1,
        since: Time.DAWN_OF_TIME
      }
    ).then(messages => {
      if (messages.length > 0) {
        Log.debug('Setting device data message', messages[0]);
        this.lastDeviceData = messages[0];
      }
    });
  }

  toggle() {
    Log.debug('Toggled device', this.device);
    if (!this.lastDeviceData) {
      Log.debug('Device did not have lastDeviceData. Fetching...');
      this.fetchLastMessageData();
    }
    this.active = !this.active;
  }

  deleteDevice() {
    Log.debug('User wants to delete device', this.device);
    this.eventAggregator.publish('device:delete', this.device);
  }

  provisionDevice() {
    Log.debug('User wants to provision device', this.device);
    this.dialogService.open({
      viewModel: ProvisionDeviceDialog,
      model: {
        appEUI: this.appeui,
        device: this.device
      }
    });
  }
}
