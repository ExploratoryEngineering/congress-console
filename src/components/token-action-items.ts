import { bindable, autoinject } from 'aurelia-framework';
import { LogBuilder } from 'Helpers/LogBuilder';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Token } from 'Models/Token';

const Log = LogBuilder.create('Token action items');

@autoinject
export class TokenActionItems {
  @bindable
  token: Token;

  constructor(
    private eventAggregator: EventAggregator
  ) { }

  deleteToken() {
    Log.debug('User wants to delete token', this.token);
    this.eventAggregator.publish('token:delete', this.token);
  }
}
