import {App} from 'app';

class RouterStub {
  configure(handler) {
    handler(this);
  }

  addAuthorizeStep(authorizeFunction) {
    this.authStep = authorizeFunction;
  }

  map(routes) {
    this.routes = routes;
  }
}

describe('the App module', () => {
  var sut;
  var mockedRouter;

  beforeEach(() => {
    mockedRouter = new RouterStub();
    sut = new App();
    sut.configureRouter(mockedRouter, mockedRouter);
  });

  it('contains a router property', () => {
    expect(sut.router).toBeDefined();
  });

  it('configures the router title', () => {
    expect(sut.router.title).toEqual('Telenor LORA');
  });

  it('should have a welcome route', () => {
    expect(sut.router.routes).toContain(
      {
        route: ['welcome'],
        name: 'welcome',
        moduleId: 'views/welcome',
        nav: false,
        title: 'Welcome'
      }
    );
  });
});
