import { CreateApplicationDialog } from "Dialogs/createApplicationDialog";
import { DialogControllerMock } from "Test/mock/mocks";

class ApplicationServiceStub {
  createNewApplication(app) {
    return Promise.resolve(app);
  }
}

class ApplicationStub { }

describe("CreateApplication dialog", () => {
  let applicationServiceStub;
  let dialogControllerStub;
  let applicationStub;

  let createApplicationDialog;

  beforeEach(() => {
    applicationServiceStub = new ApplicationServiceStub();
    dialogControllerStub = new DialogControllerMock();
    applicationStub = new ApplicationStub();

    createApplicationDialog = new CreateApplicationDialog(
      applicationServiceStub,
      dialogControllerStub,
    );

    createApplicationDialog.application = applicationStub;
  });

  it("should send the current application to applicationService when submitting application", (done) => {
    spyOn(applicationServiceStub, "createNewApplication").and.callThrough();

    createApplicationDialog.submitApplication();

    expect(applicationServiceStub.createNewApplication).toHaveBeenCalledWith(applicationStub);

    done();
  });

  it("should call ok for dialog upon successful save of application", (done) => {
    spyOn(dialogControllerStub, "ok");

    createApplicationDialog.submitApplication().then(() => {
      expect(dialogControllerStub.ok).toHaveBeenCalled();
      done();
    });
  });

  it("should not call ok for dialog upon failed save of application", (done) => {
    spyOn(dialogControllerStub, "ok");
    applicationServiceStub.createNewApplication = () => {
      return Promise.reject(new Error("Test that error works"));
    };

    createApplicationDialog.submitApplication().then(() => {
      expect(dialogControllerStub.ok).not.toHaveBeenCalled();
      done();
    });
  });
});
