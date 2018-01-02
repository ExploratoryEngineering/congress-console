import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable, containerless } from "aurelia-framework";

import { BadRequestError, Conflict } from "Helpers/ResponseHandler";
import { Device } from "Models/Device";

import { DeviceService, NewMessageData } from "Services/DeviceService";

@containerless
@autoinject
export class DeviceMessagePanel {
  subscriptions: Subscription[] = [];

  @bindable
  appEui: string = "";
  @bindable
  device: Device;

  @bindable
  deviceMessageData: string = "";
  @bindable
  deviceMessagePort: string = "1";
  @bindable
  deviceMessageRequestAck: boolean = false;

  deviceData: Array<MessageData | NewMessageData | string> = [];

  constructor(
    private eventAggregator: EventAggregator,
    private deviceService: DeviceService,
  ) { }

  sendData() {
    this.deviceData.push("Sending message to device:\n" + JSON.stringify(this.getSendableDataMessage(), null, 2));
    this.deviceService.sendMessageToDevice(
      this.appEui,
      this.device.deviceEUI,
      this.getSendableDataMessage(),
    ).then(() => {
      this.deviceData.push("Message successfully received. Will propagate to device when able.");
    }).catch((error) => {
      if (error instanceof BadRequestError) {
        this.deviceData.push(error.content);
      } else if (error instanceof Conflict) {
        this.deviceData.push("A message is already scheduled for output.");
      } else {
        this.deviceData.push(error.content);
      }
    });
  }

  getSendableDataMessage(): NewMessageData {
    return {
      data: this.deviceMessageData,
      port: parseInt(this.deviceMessagePort, 10),
      ack: this.deviceMessageRequestAck,
    };
  }

  bind() {
    this.subscriptions.push(this.eventAggregator.subscribe("deviceData", (deviceData: MessageData) => {
      if (this.device.deviceEUI === deviceData.deviceEUI) {
        this.deviceData.push(deviceData);
      }
    }));
    this.deviceData.push("Connected to Device stream");
  }

  unbind() {
    this.subscriptions.map((subscription) => subscription.dispose());
  }
}
