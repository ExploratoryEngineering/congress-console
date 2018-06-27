import { bindable, containerless } from "aurelia-framework";

@containerless
export class CardHeader {
  @bindable
  warning: boolean = false;
  @bindable
  table: string;

  useTableSpacing() {
    return this.table || this.table === "";
  }
}
