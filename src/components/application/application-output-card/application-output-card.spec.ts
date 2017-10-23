import { ApplicationOutputCard } from './application-output-card';

import { OutputServiceMock } from 'Test/mock/mocks';

describe('Applications output card component', () => {
  let applicationOutputCard: ApplicationOutputCard;
  let outputServiceMock;

  beforeEach(() => {
    outputServiceMock = new OutputServiceMock();
    applicationOutputCard = new ApplicationOutputCard(
      outputServiceMock
    );
  });

  describe('Initialization', () => {
    it('should fetch all outputs upon bind', () => {
      const ouputServiceSpy = spyOn(outputServiceMock, 'getOutputsForApplication').and.callThrough();

      applicationOutputCard.applicationEui = '1234';
      applicationOutputCard.bind();

      expect(ouputServiceSpy).toHaveBeenCalledWith('1234');
    });

    it('should fetch all outputs upon application eui change', () => {
      const ouputServiceSpy = spyOn(outputServiceMock, 'getOutputsForApplication').and.callThrough();

      applicationOutputCard.applicationEui = '1234';
      applicationOutputCard.applicationEuiChanged();

      expect(ouputServiceSpy).toHaveBeenCalledWith('1234');
    });
  });
});
