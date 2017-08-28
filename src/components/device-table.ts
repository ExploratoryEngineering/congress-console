import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogService } from 'aurelia-dialog';
import { bindable, autoinject, PLATFORM } from 'aurelia-framework';

import { DeviceService } from 'Services/DeviceService';

import { Device } from 'Models/Device';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Device table');

@autoinject
export class DeviceTable {
  @bindable
  devices: Device[];
  @bindable
  applicationEui: string;

  constructor(
    private dialogService: DialogService,
    private deviceService: DeviceService,
    private eventAggregator: EventAggregator
  ) { }

  deleteDevice(device: Device) {
    this.dialogService.open({
      viewModel: PLATFORM.moduleName('dialogs/messageDialog'),
      model: {
        messageHeader: 'Delete device?',
        message: `Are you sure you want to delete the device with EUI: ${device.deviceEUI}`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    }).whenClosed(response => {
      if (!response.wasCancelled) {
        Log.debug('Deleting device');
        this.deviceService.deleteDevice(this.applicationEui, device).then(() => {
          this.eventAggregator.publish('global:message', {
            body: 'Device deleted'
          });
          this.devices = this.devices.filter(dev => dev.deviceEUI !== device.deviceEUI);
        });
      } else {
        Log.debug('Did not delete device');
      }
    });
  }
}
