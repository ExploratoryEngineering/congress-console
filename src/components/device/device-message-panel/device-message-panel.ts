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
    this.deviceData = ["Sending message to device:\n" + JSON.stringify(this.getSendableDataMessage(), null, 2), ...this.deviceData];
    this.deviceService.sendMessageToDevice(
      this.appEui,
      this.device.deviceEUI,
      this.getSendableDataMessage(),
    ).then(() => {
      this.deviceData = ["Message successfully received. Will propagate to device when able.", ...this.deviceData];
    }).catch((error) => {
      if (error instanceof BadRequestError) {
        this.deviceData = [error.content, ...this.deviceData];
      } else if (error instanceof Conflict) {
        this.deviceData = ["A message is already scheduled for output.", ...this.deviceData];
      } else {
        this.deviceData = [error.content, ...this.deviceData];
      }
    });
  }

  getSendableDataMessage(): NewMessageData {
    return {
      data: this.encodeStringAsHex(this.deviceMessageData),
      port: parseInt(this.deviceMessagePort, 10),
      ack: this.deviceMessageRequestAck,
    };
  }

  encodeStringAsHex(stringToBeEncoded: string): string {
    let encodedString: string = "";
    let tempHex: string = "";

    for (let i = 0; i < stringToBeEncoded.length; i += 1) {
      tempHex = stringToBeEncoded.charCodeAt(i).toString(16);
      encodedString += ("000" + tempHex).slice(-4);
    }

    return encodedString;
  }

  bind() {
    this.subscriptions.push(this.eventAggregator.subscribe("deviceData", (deviceData: MessageData) => {
      if (this.device.deviceEUI === deviceData.deviceEUI) {
        this.deviceData = [deviceData, ...this.deviceData];
      }
    }));
    this.deviceData = ["Connected to Device stream", ...this.deviceData];
  }

  unbind() {
    this.subscriptions.map((subscription) => subscription.dispose());
  }
}
