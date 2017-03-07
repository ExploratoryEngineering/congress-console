import { CreateApplicationDialog } from 'Dialogs/createApplicationDialog';


class ApplicationServiceStub {
  createNewApplication(app) {
    return Promise.resolve(app);
  }
}

class DialogControllerStub {
  ok() {}
}

class ApplicationStub {}

describe('CreateApplication dialog', () => {
  let applicationServiceStub;
  let dialogControllerStub;
  let applicationStub;

  let createApplicationDialog;

  beforeEach(() => {
    applicationServiceStub = new ApplicationServiceStub();
    dialogControllerStub = new DialogControllerStub();
    applicationStub = new ApplicationStub();

    createApplicationDialog = new CreateApplicationDialog(
      applicationServiceStub,
      dialogControllerStub
    );

    createApplicationDialog.application = applicationStub;
  });

  it('should send the current application to applicationService when submitting application', () => {
    spyOn(applicationServiceStub, 'createNewApplication').and.callThrough();

    createApplicationDialog.submitApplication();

    expect(applicationServiceStub.createNewApplication).toHaveBeenCalledWith(applicationStub);
  });

  it('should call ok for dialog upon successful save of application', (done) => {
    spyOn(dialogControllerStub, 'ok');

    createApplicationDialog.submitApplication().then(() => {
      expect(dialogControllerStub.ok).toHaveBeenCalled();
      done();
    });
  });

  it('should not call ok for dialog upon failed save of application', (done) => {
    spyOn(dialogControllerStub, 'ok');
    applicationServiceStub.createNewApplication = () => {
      return Promise.reject(new Error('Test that error works'));
    };


    createApplicationDialog.submitApplication().then(() => {
      expect(dialogControllerStub.ok).not.toHaveBeenCalled();
      done();
    });
  });
});
