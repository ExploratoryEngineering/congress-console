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
