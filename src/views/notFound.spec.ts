import { NotFound } from './notFound';

class RouterStub {
  navigateBack() { }
}

describe('Not found view', () => {
  let routerStub;
  let notFoundView;

  beforeEach(() => {
    routerStub = new RouterStub();

    notFoundView = new NotFound(routerStub);
  });

  it('should call navigateBack to router when triggering navigateBack', () => {
    let callToNavigateBack = spyOn(routerStub, 'navigateBack');

    notFoundView.navigateBack();

    expect(callToNavigateBack).toHaveBeenCalled();
  });
});
