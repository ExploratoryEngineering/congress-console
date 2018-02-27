/*
	Copyright 2018 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

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
