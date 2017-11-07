import { bindable } from "aurelia-framework";

export class SecretText {
  @bindable
  secretText: string = "";
  @bindable
  visible: boolean = false;
  @bindable
  placeholderText: string = "<secret>";

  toggleVisibility() {
    this.visible = !this.visible;
  }
}
