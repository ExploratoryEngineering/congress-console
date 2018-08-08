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
    moduleId: PLATFORM.moduleName("views/login", "login"),
    nav: false,
    title: "Login",
  },
  {
    route: ["dashboard"],
    name: "dashboard",
    moduleId: PLATFORM.moduleName("views/application-dashboard", "app-dash"),
    nav: true,
    title: "Applications",
    settings: {
      auth: true,
    },
  },
  {
    route: ["gateway-dashboard"],
    name: "gateway-dashboard",
    moduleId: PLATFORM.moduleName("views/dashboard/gateways", "gateway-dash"),
    nav: true,
    title: "Gateways",
    settings: {
      auth: true,
    },
  },
  {
    route: ["api-keys"],
    name: "api-keys",
    moduleId: PLATFORM.moduleName("views/dashboard/apiKeys", "api-dash"),
    nav: true,
    title: "API keys",
    settings: {
      auth: true,
    },
  },
  {
    route: ["share"],
    name: "share",
    moduleId: PLATFORM.moduleName("views/share/token-graph", "share-dash"),
    nav: false,
    title: "Graph from shared token",
    settings: {
      auth: false,
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
