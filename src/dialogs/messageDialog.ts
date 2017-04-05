import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

interface MessageDialogConfig {
  messageHeader: string;
  message: string;
  cancelButtonText: string;
  confirmButtonText: string;
}

@autoinject
export class MessageDialog {
  messageHeader: string;
  message: string;

  cancelButtonText: string;
  confirmButtonText: string;

  constructor(
    private dialogController: DialogController
  ) { }

  activate(args: MessageDialogConfig = {
    messageHeader: 'Default header',
    message: 'Default message',
    cancelButtonText: '',
    confirmButtonText: ''
  }) {
    this.messageHeader = args.messageHeader;
    this.message = args.message;
    this.cancelButtonText = args.cancelButtonText;
    this.confirmButtonText = args.confirmButtonText;
  }
}
