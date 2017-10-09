import { Output } from 'Models/Output';
import { OutputService } from 'Services/OutputService';
import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

const POLL_INTERVAL_MS = 10000;

@autoinject
export class OutputLogDialog {
  output: Output;
  applicationEui: string;

  intervalId: number;

  constructor(
    private dialogController: DialogController,
    private outputService: OutputService
  ) { }

  update() {
    this.outputService.getOutputByEui(this.applicationEui, this.output.eui).then((output) => {
      this.output = output;
    });
  }

  close() {
    this.dialogController.ok(this.output);
  }

  activate(args) {
    this.output = args.output;
    this.applicationEui = args.applicationEui;

    this.intervalId = window.setInterval(() => { this.update(); }, POLL_INTERVAL_MS);
  }

  deactivate() {
    window.clearInterval(this.intervalId);
  }
}
