import { browser } from 'aurelia-protractor-plugin/protractor';
import { PageObjectSkeleton } from './skeleton.po';
import { config } from '../protractor.conf';

describe('LoRa skeleton', function () {
  let poSkeleton;

  beforeEach(async () => {
    poSkeleton = new PageObjectSkeleton();
    await browser.loadAndWaitForAureliaPage(`http://localhost:${config.port}`);
  });

  it('should load the page and display the initial page title', async () => {
    await expect(poSkeleton.getCurrentPageTitle()).toBe('Telenor LoRa');
  });

  it('should load the login page on root when not authorized', async () => {
    await browser.waitForRouterComplete();
    expect(poSkeleton.getCurrentPageTitle()).toBe('Login | Telenor LORA');
  });
});
