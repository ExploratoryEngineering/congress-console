import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

@autoinject
export class EventLogDialog {
  eventLogStreamEndpoint: string = '';

  constructor(
    private dialogController: DialogController
  ) { }

  activate(args) {
    this.eventLogStreamEndpoint = args.eventLogStreamEndpoint;
  }
}
