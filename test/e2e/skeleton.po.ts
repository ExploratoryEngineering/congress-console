import { browser } from 'aurelia-protractor-plugin/protractor';

export class PageObjectSkeleton {

  constructor() { }

  getCurrentPageTitle() {
    return browser.getTitle();
  }
}
