import { EventAggregator } from 'aurelia-event-aggregator';
import { bindable, autoinject } from 'aurelia-framework';
import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Source code');

@autoinject
export class SourceCode {
  sourceTextField: HTMLTextAreaElement;
  @bindable
  headerText: string = 'Your configuration file';
  @bindable
  source: string;

  constructor(
    private eventAggregator: EventAggregator
  ) { }

  copySource() {
    Log.debug('Copying source code to clipboard');
    this.sourceTextField.select();
    this.eventAggregator.publish('global:message', { body: 'Copied code' });
    try {
      document.execCommand('copy');
    } catch (error) {
      Log.warn('Copy failed');
      // Probably no support for execCommand. Fallback.
    }
  }
}
