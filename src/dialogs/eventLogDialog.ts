import { DialogController } from "aurelia-dialog";
import { autoinject } from "aurelia-framework";

@autoinject
export class EventLogDialog {
  eventLogStreamEndpoint: string = "";

  constructor(
    private dialogController: DialogController,
  ) { }

  close() {
    this.dialogController.ok();
  }

  activate(args) {
    this.eventLogStreamEndpoint = args.eventLogStreamEndpoint;
  }
}
