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

import { browser } from "aurelia-protractor-plugin/protractor";
import { config } from "../protractor.conf";
import { PageObjectSkeleton } from "./skeleton.po";

describe("LoRa skeleton", function () {
  let poSkeleton;

  beforeEach(async () => {
    poSkeleton = new PageObjectSkeleton();
    await browser.loadAndWaitForAureliaPage(`http://localhost:${config.port}`);
  });

  it("should load the page and display the initial page title", async () => {
    await expect(poSkeleton.getCurrentPageTitle()).toBe("Telenor LoRa");
  });

  it("should load the login page on root when not authorized", async () => {
    await browser.waitForRouterComplete();
    expect(poSkeleton.getCurrentPageTitle()).toBe("Login | Telenor LORA");
  });
});
