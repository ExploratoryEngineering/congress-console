import { bindable, containerless, autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { CopyHelper } from 'Helpers/CopyHelper';
import { LogBuilder } from 'Helpers/LogBuilder';

const copyHelper = new CopyHelper();
const Log = LogBuilder.create('Code line');

@containerless
@autoinject
export class CodeLine {
  @bindable
  icon: string;
  @bindable
  code: string;

  constructor(
    private eventAggregator: EventAggregator
  ) { }

  copySource(event: MouseEvent) {
    Log.debug('Copying code line to clipboard');
    copyHelper.copyToClipBoard(this.code).then(() => {
      this.eventAggregator.publish('global:message', { body: 'Copied code' });
    }).catch(error => {
      Log.warn('Copy failed');
    });
  }
}
