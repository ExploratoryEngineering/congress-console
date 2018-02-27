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

export class RouterMock {
  authStep;
  routes;
  options = {};

  configure(handler) {
    handler(this);
  }

  addAuthorizeStep(authorizeFunction) {
    this.authStep = authorizeFunction;
  }

  mapUnknownRoutes() {
    return true;
  }

  navigate() {
    return Promise.resolve();
  }

  navigateBack() {
    return Promise.resolve();
  }

  navigateTo() {
    return Promise.resolve();
  }

  getUnknownRoute() {
    return "";
  }

  map(routes) {
    this.routes = routes;
  }
}
