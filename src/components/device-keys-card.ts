import { bindable, autoinject } from 'aurelia-framework';

import { CustomEventHelper } from 'Helpers/CustomEventHelper';
import { Device } from 'Models/Device';

@autoinject
export class DeviceKeysCard {
  @bindable
  device: Device;

  constructor(
    private element: Element
  ) { }

  provisionDevice() {
    CustomEventHelper.dispatchEvent(
      this.element,
      'provision-device',
      {
        detail: {
          device: this.device
        },
        bubbles: true
      }
    );
  }
}
