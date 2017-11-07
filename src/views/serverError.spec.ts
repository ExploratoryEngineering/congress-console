import { RouterMock } from "Test/mock/mocks";
import { ServerError } from "./serverError";

describe("Server error view", () => {
  let routerStub;
  let serverErrorView: ServerError;

  beforeEach(() => {
    routerStub = new RouterMock();

    serverErrorView = new ServerError(routerStub);
  });

  it("should call navigateBack to router when triggering navigateBack", () => {
    const callToNavigateBack = spyOn(routerStub, "navigateBack");

    serverErrorView.navigateBack();

    expect(callToNavigateBack).toHaveBeenCalled();
  });
});
