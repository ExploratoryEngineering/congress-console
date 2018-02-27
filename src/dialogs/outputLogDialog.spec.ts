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

import { Output } from "Models/Output";
import { DialogControllerMock, OutputServiceMock } from "Test/mock/mocks";
import { OutputLogDialog } from "./outputLogDialog";

describe("Output Log Dialog", () => {
  let outputLogDialog: OutputLogDialog;

  let dialogController;
  let outputService;

  beforeEach(() => {
    dialogController = new DialogControllerMock();
    outputService = new OutputServiceMock();

    outputLogDialog = new OutputLogDialog(
      dialogController,
      outputService,
    );
  });

  describe("instantiation", () => {
    it("should correctly propagate output param from activate", () => {
      outputLogDialog.activate({
        output: "Test",
      });

      expect(outputLogDialog.output).toBe("Test");
    });

    it("should correctly propagate application EUI from activate", () => {
      outputLogDialog.activate({
        applicationEui: "Test",
      });

      expect(outputLogDialog.applicationEui).toBe("Test");
    });

    it("should correctly set an interval upon activate", () => {
      outputLogDialog.activate({});

      expect(outputLogDialog.intervalId).toBeDefined();
    });
  });

  describe("update", () => {
    it("should fetch output with eui and app eui from model", () => {
      outputLogDialog.applicationEui = "1234";
      outputLogDialog.output = new Output({ eui: "1234" });

      const spy = spyOn(outputService, "getOutputByEui").and.callThrough();

      outputLogDialog.update();

      expect(spy).toHaveBeenCalledWith("1234", "1234");
    });

    it("should overwrite output with new output", (done) => {
      outputLogDialog.applicationEui = "1234";
      outputLogDialog.output = new Output({ eui: "1234" });

      outputService.getOutputByEui = () => {
        return Promise.resolve("1234");
      };

      outputLogDialog.update().then(() => {
        expect(outputLogDialog.output).toBe("1234");
        done();
      });
    });
  });
});
