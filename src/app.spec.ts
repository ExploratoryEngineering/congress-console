import { RouterMock, SignalerMock } from "Test/mock/mocks";
import { App } from "./app";

import { UserProfile } from "Models/UserProfile";

class UserInformationStub {
  fetchUserProfile() {
    return Promise.resolve(new UserProfile());
  }
}

jest.useFakeTimers();

describe("the App module", () => {
  let sut;
  let mockedRouter;
  let mockedUserInformation;
  let mockedSignaler;

  beforeEach(() => {
    mockedRouter = new RouterMock();
    mockedUserInformation = new UserInformationStub();
    mockedSignaler = new SignalerMock();
    sut = new App(mockedUserInformation, mockedSignaler, mockedRouter);
    sut.configureRouter(mockedRouter, mockedRouter);
  });

  describe("Basic functionality", () => {
    it("contains a router property", () => {
      expect(sut.router).toBeDefined();
    });

    it("configures the router title", () => {
      expect(sut.router.title).toBeTruthy();
    });

    it("should signal the signaler with updateTime", () => {
      spyOn(mockedSignaler, "signal");
      expect(mockedSignaler.signal).not.toHaveBeenCalled();
      jest.runTimersToTime(sut.UPDATE_TIME_INTERVAL_MS);
      expect(mockedSignaler.signal).toHaveBeenCalledWith("updateTime");
    });

    it("should have a application dashboard route", () => {
      expect(sut.router.routes).toContainEqual({
        route: ["dashboard"],
        name: "dashboard",
        moduleId: "views/application-dashboard",
        nav: true,
        title: "Applications",
        settings: {
          auth: true,
        },
      });
    });

    it("should contain a base redirect route", () => {
      expect(sut.router.routes).toContainEqual({ route: [""], redirect: "dashboard" });
    });
  });

  describe("Authorize functionality", () => {
    const navInstructionWithoutAuth = {
      getAllInstructions: () => {
        return [
          {
            config: {
              settings: {
                auth: false,
              },
            },
          },
        ];
      },
    };

    const navInstructionWithAuth = {
      getAllInstructions: () => {
        return [
          {
            config: {
              settings: {
                auth: true,
              },
            },
          },
        ];
      },
    };

    it("should call cancel on nav if a route is authed and user is not logged in", (done) => {
      mockedUserInformation.fetchUserProfile = () => {
        return Promise.reject(new Error());
      };

      const nextCb = {
        cancel: () => {
          return;
        },
      };
      spyOn(nextCb, "cancel");

      mockedRouter.authStep.run(navInstructionWithAuth, nextCb).then(() => {
        expect(nextCb.cancel).toHaveBeenCalled();
        done();
      });
    });

    it("should call next on nav if a route is not authed and user is not logged in", () => {
      const callback = {
        next: () => {
          return;
        },
      };
      spyOn(callback, "next");

      mockedRouter.authStep.run(navInstructionWithoutAuth, callback.next);
      expect(callback.next).toHaveBeenCalled();
    });

    it("should call next on nav if a route is auth and user is logged in", (done) => {
      const callback = {
        next: function () {
          return;
        },
      };
      spyOn(callback, "next");

      mockedRouter.authStep.run(navInstructionWithAuth, callback.next).then(() => {
        expect(callback.next).toHaveBeenCalled();
        done();
      });
    });
  });
});
