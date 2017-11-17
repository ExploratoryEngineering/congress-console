import { autoinject, bindable } from "aurelia-framework";

import { DOM } from "aurelia-pal";
import { Device } from "Models/Device";

@autoinject
export class DeviceKeysCard {
  @bindable
  device: Device;

  constructor(
    private element: Element,
  ) { }

  provisionDevice() {
    this.element.dispatchEvent(DOM.createCustomEvent(
      "provision-device",
      {
        detail: {
          device: this.device,
        },
        bubbles: true,
      },
    ));
  }
}
