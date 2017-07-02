import { ServerError } from './serverError';

class RouterStub {
  navigateBack() { }
}

describe('Server error view', () => {
  let routerStub;
  let serverErrorView: ServerError;

  beforeEach(() => {
    routerStub = new RouterStub();

    serverErrorView = new ServerError(routerStub);
  });

  it('should call navigateBack to router when triggering navigateBack', () => {
    let callToNavigateBack = spyOn(routerStub, 'navigateBack');

    serverErrorView.navigateBack();

    expect(callToNavigateBack).toHaveBeenCalled();
  });
});
