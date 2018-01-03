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
  let applicationCard;

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

  afterEach(() => {
    applicationCard.unbind();
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
