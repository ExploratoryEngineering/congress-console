import { RouterMock } from "Test/mock/mocks";
import { NotFound } from "./notFound";

describe("Not found view", () => {
  let routerStub;
  let notFoundView: NotFound;

  beforeEach(() => {
    routerStub = new RouterMock();

    notFoundView = new NotFound(routerStub);
  });

  it("should call navigateBack to router when triggering navigateBack", () => {
    const callToNavigateBack = spyOn(routerStub, "navigateBack");

    notFoundView.navigateBack();

    expect(callToNavigateBack).toHaveBeenCalled();
  });
});
