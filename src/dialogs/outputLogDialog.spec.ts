import { Output } from 'Models/Output';
import { DialogControllerMock, OutputServiceMock } from 'Test/mock/mocks';
import { OutputLogDialog } from './outputLogDialog';

describe('Output Log Dialog', () => {
  let outputLogDialog: OutputLogDialog;

  let dialogController;
  let outputService;

  beforeEach(() => {
    dialogController = new DialogControllerMock();
    outputService = new OutputServiceMock();

    outputLogDialog = new OutputLogDialog(
      dialogController,
      outputService
    );
  });

  describe('instantiation', () => {
    it('should correctly propagate output param from activate', () => {
      outputLogDialog.activate({
        output: 'Test'
      });

      expect(outputLogDialog.output).toBe('Test');
    });

    it('should correctly propagate application EUI from activate', () => {
      outputLogDialog.activate({
        applicationEui: 'Test'
      });

      expect(outputLogDialog.applicationEui).toBe('Test');
    });

    it('should correctly set an interval upon activate', () => {
      outputLogDialog.activate({});

      expect(outputLogDialog.intervalId).toBeDefined();
    });
  });

  describe('update', () => {
    it('should fetch output with eui and app eui from model', () => {
      outputLogDialog.applicationEui = '1234';
      outputLogDialog.output = new Output({ eui: '1234' });

      const spy = spyOn(outputService, 'getOutputByEui').and.callThrough();

      outputLogDialog.update();

      expect(spy).toHaveBeenCalledWith('1234', '1234');
    });

    it('should overwrite output with new output', (done) => {
      outputLogDialog.applicationEui = '1234';
      outputLogDialog.output = new Output({ eui: '1234' });

      outputService.getOutputByEui = () => {
        return Promise.resolve('1234');
      };

      outputLogDialog.update().then(() => {
        expect(outputLogDialog.output).toBe('1234');
        done();
      });
    });
  });
});
