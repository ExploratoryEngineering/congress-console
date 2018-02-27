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
