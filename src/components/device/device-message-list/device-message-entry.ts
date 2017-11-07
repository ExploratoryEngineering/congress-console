import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, bindable } from "aurelia-framework";
import { CopyHelper } from "Helpers/CopyHelper";

@autoinject
export class DeviceMessageEntry {
  @bindable
  deviceMessage: MessageData;

  copyHelper = new CopyHelper();

  toggled: boolean = false;

  constructor(
    private eventAggregator: EventAggregator,
  ) { }

  toggle() {
    this.toggled = !this.toggled;
  }

  bind() {
    this.toggled = false;
  }

  copyAsJson(event: MouseEvent): Promise<any> {
    event.stopPropagation();
    event.preventDefault();

    return this.copyHelper.copyToClipBoard(JSON.stringify(this.deviceMessage)).then(() => {
      this.eventAggregator.publish("global:message", { body: "Copied code" });
    });
  }
}
