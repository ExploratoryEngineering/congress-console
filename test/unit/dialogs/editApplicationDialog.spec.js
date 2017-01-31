import { EditApplicationDialog } from 'Dialogs/editApplicationDialog';


class ApplicationServiceStub {
  updateApplication(app) {
    return Promise.resolve(app);
  }
}

class DialogControllerStub {
  ok() { }
}

class ApplicationStub {}

describe('EditApplication dialog', () => {
  let applicationServiceStub;
  let dialogControllerStub;
  let applicationStub;

  let editApplicationDialog;

  beforeEach(() => {
    applicationServiceStub = new ApplicationServiceStub();
    dialogControllerStub = new DialogControllerStub();
    applicationStub = new ApplicationStub();

    editApplicationDialog = new EditApplicationDialog(
      applicationServiceStub,
      dialogControllerStub
    );

    editApplicationDialog.application = applicationStub;
  });

  describe('Activate lifecycle', () => {
    it('should propagate given application in activate', () => {
      editApplicationDialog.activate({ application: applicationStub });

      expect(editApplicationDialog.application).toBe(applicationStub);
    });
  });

  describe('Submitting application', () => {
    it('should send the current application to applicationService when submitting application', () => {
      spyOn(applicationServiceStub, 'updateApplication').and.callThrough();

      editApplicationDialog.submitApplication();

      expect(applicationServiceStub.updateApplication).toHaveBeenCalledWith(applicationStub);
    });

    it('should call ok for dialog upon successful update of application', (done) => {
      spyOn(dialogControllerStub, 'ok');

      editApplicationDialog.submitApplication().then(() => {
        expect(dialogControllerStub.ok).toHaveBeenCalled();
        done();
      });
    });

    it('should not call ok for dialog upon failed update of application', (done) => {
      spyOn(dialogControllerStub, 'ok');
      applicationServiceStub.updateApplication = () => {
        return Promise.reject(new Error('Test that error works'));
      };

      editApplicationDialog.submitApplication().then(() => {
        expect(dialogControllerStub.ok).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
