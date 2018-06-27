import { autoinject, bindable, containerless } from "aurelia-framework";

@autoinject
@containerless
export class CardActions {
  @bindable
  alignRight;
  @bindable
  test;

  hasProp(property: string) {
    return this[property] || this[property] === "";
  }
}
