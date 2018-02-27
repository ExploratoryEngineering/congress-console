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

import { Snackbar } from "./snackbar";

class EventAggregatorStub {
  subscribe() { return; }
  publish() { return; }
}

jest.useFakeTimers();

describe("Snackbar component", () => {
  let snackbar;
  let eventAggregatorStub;

  beforeEach(() => {
    eventAggregatorStub = new EventAggregatorStub();
    snackbar = new Snackbar(eventAggregatorStub);
  });

  it("should subscribe to the default global scope when no scope is given upon bind", () => {
    spyOn(eventAggregatorStub, "subscribe");
    snackbar.bind();
    expect(eventAggregatorStub.subscribe).toHaveBeenCalledWith("global:message", jasmine.anything());
  });

  it("should unsubscribe to old subs upon unbind", () => {
    const testSubscription = { dispose: () => { return; } };
    spyOn(testSubscription, "dispose");

    snackbar.subscriptions.push(testSubscription);
    snackbar.unbind();

    expect(testSubscription.dispose).toHaveBeenCalled();
  });

  it("should handle messages without timeout", () => {
    spyOn(snackbar, "showMessage");

    snackbar.publishMessage({ body: "test" });
    expect(snackbar.showMessage).toHaveBeenCalledWith({ body: "test", timeout: snackbar.DEFAULT_TIMEOUT });
  });

  it("should handle messages with timeout", () => {
    const customTimeout = 7500;
    spyOn(snackbar, "showMessage");

    snackbar.publishMessage({ body: "test", timeout: customTimeout });
    expect(snackbar.showMessage).toHaveBeenCalledWith({ body: "test", timeout: customTimeout });
  });

  it("should replace the current promise in queue with new promise", () => {
    const oldMessageQueue = snackbar.messageQueue;

    snackbar.showMessage({ body: "test", timeout: 2500 });

    expect(oldMessageQueue).not.toBe(snackbar.messageQueue);
  });

  it("should set text and mark snackbar as active when activating message", () => {
    snackbar.activateMessage("test");

    expect(snackbar.message).toBe("test");
    expect(snackbar.isActive).toBe(true);
  });

  it("should correctly set deactivation timeout for message", () => {
    const cb = { spy: () => { return; } };
    const timeout = 500;
    spyOn(cb, "spy");

    snackbar.activateMessage("test");
    snackbar.setDeactivationTimeout(timeout, cb.spy);

    expect(snackbar.isActive).toBe(true);
    expect(snackbar.message).toBe("test");

    jest.runTimersToTime(timeout - 250);

    expect(snackbar.isActive).toBe(false);

    jest.runTimersToTime(timeout - 250);
    expect(snackbar.message).toBe("");
    expect(cb.spy).toHaveBeenCalled();
  });
});
