import { EventAggregator } from 'aurelia-event-aggregator';
import { LogBuilder } from 'Helpers/LogBuilder';
import { bindable, containerless, autoinject } from 'aurelia-framework';

const Log = LogBuilder.create('Code line');

@containerless
@autoinject
export class CodeLine {
  @bindable
  icon: string;
  @bindable
  code: string;
  codeTextField: HTMLInputElement;

  constructor(
    private eventAggregator: EventAggregator
  ) { }

  copySource() {
    Log.debug('Copying code line to clipboard');
    this.codeTextField.select();
    try {
      document.execCommand('copy');
      this.eventAggregator.publish('global:message', { body: 'Copied code' });
    } catch (error) {
      Log.warn('Copy failed');
    }
  }
}
