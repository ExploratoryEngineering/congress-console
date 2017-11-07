import { browser } from "aurelia-protractor-plugin/protractor";

export class PageObjectSkeleton {
  getCurrentPageTitle() {
    return browser.getTitle();
  }
}
