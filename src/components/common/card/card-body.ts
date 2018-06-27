import { bindable, containerless } from "aurelia-framework";

@containerless
export class CardBody {
  @bindable
  noPadding: string;

  hasPadding() {
    return !this.noPadding && this.noPadding !== "";
  }
}
