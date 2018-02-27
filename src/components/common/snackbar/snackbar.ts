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

import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable } from "aurelia-framework";
import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("Snackbar");

interface Message {
  body: string;
  timeout: number;
  callback?: () => void;
}

@autoinject
export class Snackbar {
  DEFAULT_TIMEOUT: number = 3000;
  @bindable
  scope: string = "global";
  isActive: boolean = false;
  subscriptions: Subscription[] = [];

  messageQueue: Promise<any> = Promise.resolve();
  message: string = "";

  constructor(
    private eventAggregator: EventAggregator,
  ) { }

  publishMessage({
    timeout = this.DEFAULT_TIMEOUT,
    body,
  }: Message = { body: "", timeout: this.DEFAULT_TIMEOUT }) {
    Log.debug("Received message", body, timeout);

    this.showMessage({
      body: body,
      timeout: timeout,
    });
  }

  showMessage(message: Message) {
    this.messageQueue = this.messageQueue.then(() => {
      return new Promise((res, rej) => {
        this.activateMessage(message.body);
        this.setDeactivationTimeout(message.timeout, res);
      });
    });
  }

  activateMessage(message: string) {
    this.isActive = true;
    this.message = message;
  }

  setDeactivationTimeout(timeout: number, res) {
    setTimeout(() => {
      this.message = "";
      res();
    }, timeout);

    setTimeout(() => {
      this.isActive = false;
    }, timeout - 250);
  }

  bind() {
    this.eventAggregator.subscribe(`${this.scope}:message`, (message) => this.publishMessage(message));
  }

  unbind() {
    this.subscriptions.forEach((subscription) => subscription.dispose());
    this.subscriptions = [];
  }
}
