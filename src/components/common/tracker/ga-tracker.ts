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

import { AureliaConfiguration } from "aurelia-configuration";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable, noView } from "aurelia-framework";
import { customElement } from "aurelia-templating";

import { NavigationInstruction } from "aurelia-router";
import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("Google Analytics Tracker");

declare global {
  interface Window {
    gtag: any;
    dataLayer: any[];
  }
}

@noView()
@customElement("ga-tracker")
@autoinject
export class GATracker {
  subscriptions: Subscription[] = [];

  constructor(
    private eventAggregator: EventAggregator,
    private config: AureliaConfiguration,
  ) { }

  bind() {
    this.subscriptions.push(this.eventAggregator.subscribe("router:navigation:complete", (navigationEvent) => {
      this.handleNavigationComplete(navigationEvent);
    }));
  }

  unbind() {
    this.subscriptions.forEach((subscription) => subscription.dispose());
    this.subscriptions = [];
  }

  handleNavigationComplete(navigationEvent) {
    const instruction: NavigationInstruction = navigationEvent.instruction;

    this.getGtag()("config", this.config.get("googleAnalytics"), {
      page_title: this.getPageTitle(instruction),
      page_path: this.getPagePath(instruction),
      anonymize_ip: true,
    });
  }

  private getGtag() {
    window.dataLayer = window.dataLayer || [];
    const dataLayer = window.dataLayer;
    return window.gtag || function gtag() {
      dataLayer.push(arguments);
      Log.debug("Google Analytics not available, pushing to dataLayer", dataLayer);
    };
  }

  private getPageTitle(navigationInstruction: NavigationInstruction): string {
    return navigationInstruction.config.title;
  }

  private getPagePath(navigationInstruction: NavigationInstruction): string {
    return navigationInstruction.fragment;
  }
}
