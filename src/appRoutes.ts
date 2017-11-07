import { PLATFORM } from "aurelia-pal";
import { RouteConfig } from "aurelia-router/dist/aurelia-router";

export let routes: RouteConfig[] = [
  {
    route: [""],
    redirect: "dashboard",
  },
  {
    route: ["login"],
    name: "login",
    moduleId: PLATFORM.moduleName("views/login"),
    nav: false,
    title: "Login",
  },
  {
    route: ["dashboard"],
    name: "dashboard",
    moduleId: PLATFORM.moduleName("views/application-dashboard"),
    nav: true,
    title: "Applications",
    settings: {
      auth: true,
    },
  },
  {
    route: ["gateway-dashboard"],
    name: "gateway-dashboard",
    moduleId: PLATFORM.moduleName("views/dashboard/gateways"),
    nav: true,
    title: "Gateways",
    settings: {
      auth: true,
    },
  },
  {
    route: ["api-keys"],
    name: "api-keys",
    moduleId: PLATFORM.moduleName("views/dashboard/apiKeys"),
    nav: true,
    title: "API keys",
    settings: {
      auth: true,
    },
  },
  {
    route: ["server-error"],
    name: "server-error",
    moduleId: PLATFORM.moduleName("views/serverError"),
    nav: false,
    title: "Server issues - Stay calm",
    settings: {
      auth: false,
    },
  },
  {
    route: ["not-found"],
    name: "not-found",
    moduleId: PLATFORM.moduleName("views/notFound"),
    nav: false,
    title: "Could not find your page",
    settings: {
      auth: false,
    },
  },
];
