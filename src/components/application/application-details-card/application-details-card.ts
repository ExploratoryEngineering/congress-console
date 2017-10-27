import { Application } from 'Models/Application';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject, bindable } from 'aurelia-framework';

import './application-details-card.scss';

@autoinject
export class ApplicationDetailsCard {
  @bindable
  application: Application;

  constructor(
    private eventAggregator: EventAggregator
  ) { }

  editApplication() {
    this.eventAggregator.publish('application:edit', this.application);
  }
}