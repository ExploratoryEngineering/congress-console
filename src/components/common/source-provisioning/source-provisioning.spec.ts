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

import { EventAggregatorMock } from "Test/mock/mocks";
import { SourceProvisioning } from "./source-provisioning";

describe("Source provisioning", () => {
  let sourceProvisioning: SourceProvisioning;
  let eventAggregatorMock;

  beforeEach(() => {
    eventAggregatorMock = new EventAggregatorMock();
    sourceProvisioning = new SourceProvisioning(eventAggregatorMock);
  });

  describe("Lifecycle", () => {
    it("should correctly set the first array element as selected upon bind", () => {
      sourceProvisioning.availableSourceTypes = ["lopy"];
      sourceProvisioning.bind();
      expect(sourceProvisioning.sourceType).toBe("lopy");
    });
  });

  describe("Basic functionality", () => {
    it("Should return correct source code based on source code selected", () => {
      sourceProvisioning.lopySource = "lopy source";
      sourceProvisioning.setSourceType("lopy");
      expect(sourceProvisioning.selectedSourceCode).toBe("lopy source");
    });

    it("Should correctly update code if fed new source", () => {
      sourceProvisioning.cSource = "c source";
      sourceProvisioning.setSourceType("c");

      expect(sourceProvisioning.selectedSourceCode).toBe("c source");

      sourceProvisioning.cSource = "new updated c source";

      expect(sourceProvisioning.selectedSourceCode).toBe("new updated c source");
    });

    it("Should correctly call CopyHelper with selected code upon calling copy", () => {
      sourceProvisioning.lopySource = "lopy source";
      sourceProvisioning.setSourceType("lopy");

      const spy = spyOn(sourceProvisioning.copyHelper, "copyToClipBoard").and.callFake(() => Promise.resolve());

      sourceProvisioning.copySource();

      expect(spy).toHaveBeenCalledWith("lopy source");
    });

    it("Should correctly call event aggregator with message when copied successfully", (done) => {
      sourceProvisioning.lopySource = "lopy source";
      sourceProvisioning.setSourceType("lopy");

      spyOn(sourceProvisioning.copyHelper, "copyToClipBoard").and.callFake(() => Promise.resolve());
      const spy = spyOn(eventAggregatorMock, "publish").and.callFake(() => Promise.resolve());

      sourceProvisioning.copySource().then(() => {
        expect(spy).toHaveBeenCalledWith("global:message", jasmine.anything());
        done();
      });
    });
  });
});
