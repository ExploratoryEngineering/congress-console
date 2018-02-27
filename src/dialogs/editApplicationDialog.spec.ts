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

import { EditApplicationDialog } from "Dialogs/editApplicationDialog";
import { DialogControllerMock } from "Test/mock/mocks";

class ApplicationServiceStub {
  updateApplication(app) {
    return Promise.resolve(app);
  }
}

class ApplicationStub { }

describe("EditApplication dialog", () => {
  let applicationServiceStub;
  let dialogControllerStub;
  let applicationStub;

  let editApplicationDialog;

  beforeEach(() => {
    applicationServiceStub = new ApplicationServiceStub();
    dialogControllerStub = new DialogControllerMock();
    applicationStub = new ApplicationStub();

    editApplicationDialog = new EditApplicationDialog(
      applicationServiceStub,
      dialogControllerStub,
    );

    editApplicationDialog.application = applicationStub;
  });

  describe("Activate lifecycle", () => {
    it("should propagate given application in activate", () => {
      editApplicationDialog.activate({ application: applicationStub });

      expect(editApplicationDialog.application).toBe(applicationStub);
    });
  });

  describe("Submitting application", () => {
    it("should send the current application to applicationService when submitting application", () => {
      spyOn(applicationServiceStub, "updateApplication").and.callThrough();

      editApplicationDialog.submitApplication();

      expect(applicationServiceStub.updateApplication).toHaveBeenCalledWith(applicationStub);
    });

    it("should call ok for dialog upon successful update of application", (done) => {
      spyOn(dialogControllerStub, "ok");

      editApplicationDialog.submitApplication().then(() => {
        expect(dialogControllerStub.ok).toHaveBeenCalled();
        done();
      });
    });

    it("should not call ok for dialog upon failed update of application", (done) => {
      spyOn(dialogControllerStub, "ok");
      applicationServiceStub.updateApplication = () => {
        return Promise.reject(new Error("Test that error works"));
      };

      editApplicationDialog.submitApplication().then(() => {
        expect(dialogControllerStub.ok).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
