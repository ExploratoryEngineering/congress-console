/*
	Copyright 2018 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

import { DialogController } from "aurelia-dialog";
import { autoinject } from "aurelia-framework";

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
    private dialogController: DialogController,
  ) { }

  ok() {
    this.dialogController.ok();
  }

  cancel() {
    this.dialogController.cancel();
  }

  activate(args: MessageDialogConfig = {
    messageHeader: "Default header",
    message: "Default message",
    cancelButtonText: "",
    confirmButtonText: "",
  }) {
    this.messageHeader = args.messageHeader;
    this.message = args.message;
    this.cancelButtonText = args.cancelButtonText;
    this.confirmButtonText = args.confirmButtonText;
  }
}
