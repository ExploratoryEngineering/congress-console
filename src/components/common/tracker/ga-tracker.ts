import { AureliaConfiguration } from 'aurelia-configuration';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { bindable, noView, autoinject } from 'aurelia-framework';
import { customElement } from 'aurelia-templating';

import { LogBuilder } from 'Helpers/LogBuilder';
import { NavigationInstruction } from 'aurelia-router';

const Log = LogBuilder.create('Google Analytics Tracker');

declare global {
  interface Window {
    gtag: any;
    dataLayer: any[];
  }
}

@noView()
@customElement('ga-tracker')
@autoinject
export class GATracker {
  subscriptions: Subscription[] = [];

  constructor(
    private eventAggregator: EventAggregator,
    private config: AureliaConfiguration
  ) { }

  bind() {
    this.subscriptions.push(this.eventAggregator.subscribe('router:navigation:complete', (navigationEvent) => {
      this.handleNavigationComplete(navigationEvent);
    }));
  }

  unbind() {
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.subscriptions = [];
  }

  handleNavigationComplete(navigationEvent) {
    const instruction: NavigationInstruction = navigationEvent.instruction;

    this.getGtag()('config', this.config.get('googleAnalytics'), {
      'page_title': this.getPageTitle(instruction),
      'page_path': this.getPagePath(instruction),
      'anonymize_ip': true
    });
  }

  private getGtag() {
    window.dataLayer = window.dataLayer || [];
    let dataLayer = window.dataLayer;
    return window.gtag || function gtag() {
      dataLayer.push(arguments);
      Log.debug('Google Analytics not available, pushing to dataLayer', dataLayer);
    };
  }

  private getPageTitle(navigationInstruction: NavigationInstruction): string {
    return navigationInstruction.config.title;
  }

  private getPagePath(navigationInstruction: NavigationInstruction): string {
    return navigationInstruction.fragment;
  }
}
