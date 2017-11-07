import { Login } from "./login";

class AureliaConfigurationStub {
  get() {
    return "https://configuration.url";
  }
}

class RouterStub { }

describe("Login view", () => {
  let configStub;
  let routerStub;
  let loginView: Login;

  beforeEach(() => {
    configStub = new AureliaConfigurationStub();
    routerStub = new RouterStub();
    loginView = new Login(routerStub, configStub);
  });

  it("should return the correct url for login", () => {
    expect(loginView.getLoginUrl()).toBe("https://configuration.url/connect/login");
  });

  it("should return the correct url for logout", () => {
    expect(loginView.getLogoutUrl()).toBe("https://configuration.url/connect/logout");
  });
});
