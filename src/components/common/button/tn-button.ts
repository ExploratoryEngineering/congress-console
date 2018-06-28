import { autoinject, bindable } from "aurelia-framework";

@autoinject
export class TnButton {
  @bindable
  primary: boolean | string = false;
  @bindable
  flat: boolean | string = false;
  @bindable
  raised: boolean | string = false;

  @bindable
  focused: boolean | string = false;

  @bindable
  disabled: boolean | string = false;
  @bindable
  type: string = "button";

  tnButton: HTMLElement;
  button: HTMLButtonElement;

  bind() {
    this.setDisabled();
    this.setType();
  }

  attached() {
    this.setFocus();
  }

  disabledChanged() {
    this.setDisabled();
  }

  typeChanged() {
    this.setType();
  }

  focusChanged() {
    this.setFocus();
  }

  hasProp(property: string): boolean {
    return this[property] || this[property] === "";
  }

  private setDisabled() {
    if (this.hasProp("disabled")) {
      this.button.setAttribute("disabled", "disabled");
    } else {
      this.button.removeAttribute("disabled");
    }
  }

  private setType() {
    this.button.setAttribute("type", this.type);
  }

  private setFocus() {
    if (this.hasProp("focused")) {
      this.button.focus();
    }
  }
}
