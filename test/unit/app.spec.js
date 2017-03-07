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

  beforeEach(() => {
    mockedRouter = new RouterStub();
    mockedUserInformation = new UserInformationStub();
    sut = new App(mockedRouter, mockedUserInformation);
    sut.configureRouter(mockedRouter, mockedRouter);
  });

  describe('Basic functionality', () => {
    it('contains a router property', () => {
      expect(sut.router).toBeDefined();
    });

    it('configures the router title', () => {
      expect(sut.router.title).toBeTruthy();
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
});
