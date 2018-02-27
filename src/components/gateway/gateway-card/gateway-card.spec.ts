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

import { Gateway } from "Models/Gateway";
import { EventAggregatorMock, GatewayServiceMock } from "Test/mock/mocks";
import { GatewayCard } from "./gateway-card";

describe("Gatewaycard component", () => {
  let gatewayCard: GatewayCard;

  let eventAggregatorStub;
  let gatewayServiceStub;
  let gatewayStub;

  beforeEach(() => {
    eventAggregatorStub = new EventAggregatorMock();
    gatewayStub = new Gateway();
    gatewayServiceStub = new GatewayServiceMock();

    gatewayCard = new GatewayCard(eventAggregatorStub, gatewayServiceStub);
    gatewayCard.gateway = gatewayStub;
  });

  describe("Binding behaviour", () => {
    it("should initiate chartData upon bind", () => {
      expect(gatewayCard.chartData).toBeFalsy();

      spyOn(gatewayCard, "initiateChartData");

      gatewayCard.bind();

      expect(gatewayCard.initiateChartData).toHaveBeenCalled();
    });
  });

  describe("Chart data", () => {
    it("should have no data upon initialization", () => {
      expect(gatewayCard.chartData).toBeFalsy();
    });
  });

  describe("Event handling", () => {
    it("should emit the correct event upon edit call", () => {
      spyOn(eventAggregatorStub, "publish");

      gatewayCard.editGateway();

      expect(eventAggregatorStub.publish).toHaveBeenCalledWith("gateway:edit", gatewayStub);
    });
  });
});
