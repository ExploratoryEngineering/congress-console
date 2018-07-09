import { bindable, containerless } from "aurelia-framework";

@containerless
export class CardHeader {
  @bindable
  warning: boolean = false;
  @bindable
  table: string;

  hasProp(property: string) {
    return this[property] || this[property] === "";
  }
}
