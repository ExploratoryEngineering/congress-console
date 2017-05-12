import { App } from 'app';
import { UserProfile } from 'Models/UserProfile';

class RouterStub {
  constructor() {}

  configure(handler) {
    handler(this);
  }

  addAuthorizeStep(authorizeFunction) {
    this.authStep = authorizeFunction;
  }

  mapUnknownRoutes() {
    return true;
  }

  getUnknownRoute() {
    return '';
  }

  map(routes) {
    this.routes = routes;
  }
}

class SignalerStub {
  signal() {}
}

class UserInformationStub {
  constructor() {}

  fetchUserProfile() {
    return Promise.resolve(new UserProfile());
  }
}

describe('the App module', () => {
  let sut;
  let mockedRouter;
  let mockedUserInformation;
  let mockedSignaler;

  beforeEach(() => {
    jasmine.clock().install();
    mockedRouter = new RouterStub();
    mockedUserInformation = new UserInformationStub();
    mockedSignaler = new SignalerStub();
    sut = new App(mockedRouter, mockedUserInformation, mockedSignaler);
    sut.configureRouter(mockedRouter, mockedRouter);
  });

  describe('Basic functionality', () => {
    it('contains a router property', () => {
      expect(sut.router).toBeDefined();
    });

    it('configures the router title', () => {
      expect(sut.router.title).toBeTruthy();
    });

    it('should signal the signaler with updateTime', () => {
      spyOn(mockedSignaler, 'signal');
      expect(mockedSignaler.signal).not.toHaveBeenCalled();
      jasmine.clock().tick(sut.UPDATE_TIME_INTERVAL_MS);
      expect(mockedSignaler.signal).toHaveBeenCalledWith('updateTime');
    });

    it('should have a application dashboard route', () => {
      expect(sut.router.routes).toContain(
        {
          route: [ 'dashboard' ],
          name: 'dashboard',
          moduleId: 'views/application-dashboard',
          nav: true,
          title: 'Applications',
          settings: {
            auth: true
          }
        }
      );
    });

    it('should contain a base redirect route', () => {
      expect(sut.router.routes).toContain(
        { route: [ '' ], redirect: 'dashboard' }
      );
    });
  });

  describe('Authorize functionality', () => {
    const navInstructionWithoutAuth = {
      getAllInstructions: () => {
        return [
          {
            config: {
              settings: {
                auth: false
              }
            }
          }
        ];
      }
    };

    const navInstructionWithAuth = {
      getAllInstructions: () => {
        return [
          {
            config: {
              settings: {
                auth: true
              }
            }
          }
        ];
      }
    };

    it('should call cancel on nav if a route is authed and user is not logged in', (done) => {
      mockedUserInformation.fetchUserProfile = () => {
        return Promise.reject(new Error());
      };

      let nextCb = {
        cancel: () => {}
      };
      spyOn(nextCb, 'cancel');

      mockedRouter.authStep.run(navInstructionWithAuth, nextCb).then(() => {
        expect(nextCb.cancel).toHaveBeenCalled();
        done();
      });
    });

    it('should call next on nav if a route is not authed and user is not logged in', () => {
      let callback = {
        next: () => {}
      };
      spyOn(callback, 'next');

      mockedRouter.authStep.run(navInstructionWithoutAuth, callback.next);
      expect(callback.next).toHaveBeenCalled();
    });

    it('should call next on nav if a route is auth and user is logged in', (done) => {
      let callback = {
        next: function() {}
      };
      spyOn(callback, 'next');

      mockedRouter.authStep.run(navInstructionWithAuth, callback.next).then(() => {
        expect(callback.next).toHaveBeenCalled();
        done();
      });
    });
  });
  afterEach(() => {
    jasmine.clock().uninstall();
  });
});
