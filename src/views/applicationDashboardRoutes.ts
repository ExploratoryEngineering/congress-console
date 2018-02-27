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

export const routes = [
  {
    route: ["", "applications"],
    name: "applications_overview",
    moduleId: PLATFORM.moduleName("./dashboard/applications"),
    nav: false,
    title: "Applications",
  },
  {
    route: ["applications/:applicationId/details"],
    name: "application_details",
    moduleId: PLATFORM.moduleName("./dashboard/applications/applicationDetails"),
    nav: true,
    href: "#/dashboard/application",
    title: "Overview",
  },
  {
    route: ["applications/:applicationId/devices"],
    name: "application_devices",
    moduleId: PLATFORM.moduleName("./dashboard/applications/applicationDevices"),
    nav: true,
    href: "#/dashboard/applications",
    title: "Devices",
  },
  {
    route: ["applications/:applicationId/devices/:deviceId?"],
    name: "application_device",
    moduleId: PLATFORM.moduleName("./dashboard/applications/applicationDevicesDetails"),
    nav: false,
    href: "#/dashboard/applications",
    title: "Device",
  },
  {
    route: ["applications/:applicationId/outputs"],
    name: "application_outputs",
    moduleId: PLATFORM.moduleName("./dashboard/applications/applicationOutputs"),
    nav: true,
    href: "#/dashboard/applications",
    title: "Outputs",
  },

];
