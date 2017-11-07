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
