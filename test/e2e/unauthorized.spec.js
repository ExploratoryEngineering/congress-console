import { PageObjectSkeleton } from './skeleton.po.js';

describe('LoRa skeleton', function() {
  let poSkeleton;

  beforeEach(() => {
    poSkeleton = new PageObjectSkeleton();
    browser.loadAndWaitForAureliaPage('http://localhost:9000');
  });

  it('should load the page and display the initial page title', () => {
    expect(poSkeleton.getCurrentPageTitle()).toBe('Telenor LoRa');
  });

  it('should load the login page on root when not authorized', () => {
    browser.waitForRouterComplete();
    expect(poSkeleton.getCurrentPageTitle()).toBe('Login | Telenor LORA');
  });
});
