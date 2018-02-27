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

import { routes as appRoutes } from "./appRoutes";

const includesRouteName = (routeName) => {
  return appRoutes.some((routeConfig) => {
    return routeConfig.route.includes(routeName);
  });
};

describe("Application routes", () => {
  it("should have a server error route", () => expect(includesRouteName("server-error")).toBe(true));
  it("should have a not found route", () => expect(includesRouteName("not-found")).toBe(true));
  it("should have a login route", () => expect(includesRouteName("login")).toBe(true));
  it("should have a dashboard route", () => expect(includesRouteName("dashboard")).toBe(true));
  it("should have a gateway route", () => expect(includesRouteName("gateway-dashboard")).toBe(true));
  it("should have a api key route", () => expect(includesRouteName("api-keys")).toBe(true));
  it("should have a default redirect to dashobard", () => {
    expect(appRoutes.some((routeConfig) => {
      return routeConfig.route.includes("") && routeConfig.redirect === "dashboard";
    })).toBe(true);
  });
});
