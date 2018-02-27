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
import { ApplicationCard } from "./application-card";

class ApplicationStub {
}

class ApplicationServiceStub {
  fetchApplicationDataByEUI() {
    return Promise.resolve([]);
  }
}

describe("ApplicationCard component", () => {
  let applicationCard: ApplicationCard;

  let eventAggregatorStub;
  let applicationServiceStub;
  let applicationStub;

  beforeEach(() => {
    eventAggregatorStub = new EventAggregatorMock();
    applicationStub = new ApplicationStub();
    applicationServiceStub = new ApplicationServiceStub();

    applicationCard = new ApplicationCard(eventAggregatorStub, applicationServiceStub);
    applicationCard.application = applicationStub;
  });

  describe("Binding behaviour", () => {
    it("should initiate chartData upon bind", () => {
      expect(applicationCard.chartData).toBeFalsy();

      spyOn(applicationCard, "initiateChartData");

      applicationCard.bind();

      expect(applicationCard.initiateChartData).toHaveBeenCalled();
    });
  });

  describe("Chart data", () => {
    it("should have no data upon initialization", () => {
      expect(applicationCard.chartData).toBeFalsy();
    });
  });

  describe("Event handling", () => {
    it("should emit the correct event upon edit call", () => {
      spyOn(eventAggregatorStub, "publish");

      applicationCard.editApplication();

      expect(eventAggregatorStub.publish).toHaveBeenCalledWith("application:edit", applicationStub);
    });
  });
});
