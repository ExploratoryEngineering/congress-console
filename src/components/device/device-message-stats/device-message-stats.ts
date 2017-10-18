import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { bindable, autoinject } from 'aurelia-framework';

import './device-message-stats.scss';

import { DeviceService } from 'Services/DeviceService';
import { Device } from 'Models/Device';

import { Time } from 'Helpers/Time';

@autoinject
export class DeviceMessageStats {
  @bindable
  applicationEui: string;
  @bindable
  device: Device;

  lastMessage: MessageData;

  loading: boolean = true;
  subscriptions: Subscription[] = [];

  constructor(
    private deviceService: DeviceService,
    private eventAggregator: EventAggregator
  ) { }

  getLastHeardFrom(): Promise<any> {
    return this.deviceService.fetchDeviceDataByEUI(
      this.applicationEui,
      this.device.deviceEUI,
      {
        limit: 1,
        since: Time.DAWN_OF_TIME
      }
    ).then(messages => {
      if (messages.length > 0) {
        this.lastMessage = messages[0];
      }
      this.loading = false;
    });
  }

  bind() {
    this.getLastHeardFrom();
    this.subscriptions.push(this.eventAggregator.subscribe('deviceData', (deviceData: MessageData) => {
      if (this.device.deviceEUI === deviceData.deviceEUI) {
        this.lastMessage = deviceData;
      }
    }));
  }

  unbind() {
    this.subscriptions.map((subscription) => subscription.dispose());
  }
}
