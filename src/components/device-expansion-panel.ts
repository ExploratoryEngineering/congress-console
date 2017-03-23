import { EventAggregator } from 'aurelia-event-aggregator';
import { LogBuilder } from 'Helpers/LogBuilder';
import { DeviceService } from 'Services/DeviceService';
import { Device } from 'Models/Device';
import { bindable, autoinject, containerless } from 'aurelia-framework';

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
    private eventAggregator: EventAggregator
  ) { }

  bind() {
    this.subscriptions.push(this.eventAggregator.subscribe('deviceDataMessage', (messageData: MessageData) => {
      Log.debug('I got data!', messageData);
      if (this.device.deviceEUI === messageData.DeviceEUI) {
        Log.debug('And it matched!');
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
        since: this.deviceService.SINCE.DAWN_OF_TIME
      }
    ).then(messages => {
      if (messages.length > 0) {
        Log.debug('Setting device data message', messages[0]);
        this.lastDeviceData = messages[0];
      }
    });
  }

  toggle() {
    Log.debug('Toggled device', this.lastDeviceData);
    if (!this.lastDeviceData) {
      this.fetchLastMessageData();
    }
    this.active = !this.active;
  }
}
