import {App} from 'app';
import UserInformation from 'Helpers/UserInformation';

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
  let sut;
  let mockedRouter;

  beforeEach(() => {
    mockedRouter = new RouterStub();
    sut = new App();
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

    beforeEach(() => {
      UserInformation.setLoggedIn(false);
    });

    it('should call cancel on nav if a route is authed and user is not logged in', () => {
      let nextCb = {
        cancel: () => {}
      };
      spyOn(nextCb, 'cancel');

      mockedRouter.authStep.run(navInstructionWithAuth, nextCb);

      expect(nextCb.cancel).toHaveBeenCalled();
    });

    it('should call next on nav if a route is not authed and user is not logged in', () => {
      let callback = {
        next: () => {}
      };
      spyOn(callback, 'next');

      mockedRouter.authStep.run(navInstructionWithoutAuth, callback.next);

      expect(callback.next).toHaveBeenCalled();
    });

    it('should call next on nav if a route is auth and user is logged in', () => {
      UserInformation.setLoggedIn(true);

      let callback = {
        next: () => {}
      };
      spyOn(callback, 'next');

      mockedRouter.authStep.run(navInstructionWithAuth, callback.next);

      expect(callback.next).toHaveBeenCalled();
    });
  });
});
