import { ApplicationCard } from 'Components/application-card';

class EventAggregatorStub {
  publish() {
  }
}

class ApplicationStub {
}

describe('ApplicationCard component', () => {
  let applicationCard;

  let eventAggregatorStub;
  let applicationStub;

  beforeEach(() => {
    eventAggregatorStub = new EventAggregatorStub();
    applicationStub = new ApplicationStub();

    applicationCard = new ApplicationCard(eventAggregatorStub);

    applicationCard.application = applicationStub;

    jasmine.clock().install();
  });

  afterEach(() => {
    applicationCard.unbind();
    jasmine.clock().uninstall();
  });

  describe('Binding behaviour', () => {
    it('should initiate chartData upon bind', () => {
      expect(applicationCard.chartData).toBeFalsy();

      applicationCard.bind();

      expect(applicationCard.chartData).toBeTruthy();
    });

    it('should add dataInterval upon bind', () => {
      applicationCard.bind();

      expect(applicationCard.dataInterval).not.toBe('');
    });

    it('should clear dataInterval upon unbind', () => {
      applicationCard.bind();
      expect(applicationCard.dataInterval).toBeTruthy();

      applicationCard.unbind();
      expect(applicationCard.dataInterval).toBeFalsy();
    });
  });

  describe('Chart data', () => {
    it('should have no data upon initialization', () => {
      expect(applicationCard.chartData).toBeFalsy();
    });

    it('should append data to existing data sets', () => {
      applicationCard.initiateChartData();

      expect(applicationCard.chartData.datasets).toBeDefined();

      // Clone array and check for length
      const data = Array.from(applicationCard.chartData.datasets[0].data);
      expect(data.length).toBeGreaterThan(0);

      // Run datainterval
      applicationCard.setDataOnInterval();
      jasmine.clock().tick(5001);

      // Check that the array does not equal clone
      expect(applicationCard.chartData.datasets[0].data).not.toEqual(data);
    });

    it('should create data structure upon calling interval when no data', () => {
      applicationCard.setDataOnInterval();
      expect(applicationCard.chartData).toBeFalsy();

      jasmine.clock().tick(applicationCard.UPDATE_INTERVAL - 50);

      expect(applicationCard.chartData).toBeFalsy();

      jasmine.clock().tick(100);

      expect(applicationCard.chartData).toBeTruthy();
    });
  });

  describe('Event handling', () => {
    it('should emit the correct event upon edit call', () => {
      spyOn(eventAggregatorStub, 'publish');

      applicationCard.editApplication();

      expect(eventAggregatorStub.publish).toHaveBeenCalledWith('application:edit', applicationStub);
    });
  });
});
