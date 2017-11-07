export class RouterMock {
  authStep;
  routes;

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
