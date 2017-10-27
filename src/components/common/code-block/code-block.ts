import { EventAggregator } from 'aurelia-event-aggregator';
import { bindable, containerless, autoinject } from 'aurelia-framework';

import { LogBuilder } from 'Helpers/LogBuilder';
import { CopyHelper } from 'Helpers/CopyHelper';

const Log = LogBuilder.create('Code line');

@containerless
@autoinject
export class CodeBlock {
  @bindable
  icon: string;
  @bindable
  code: string;
  @bindable
  heading: string;
  copyHelper: CopyHelper = new CopyHelper();

  codeTextField: HTMLInputElement;

  constructor(
    private eventAggregator: EventAggregator
  ) { }

  copySource() {
    Log.debug('Copying code line to clipboard');
    this.copyHelper.copyToClipBoard(this.code).then(() => {
      this.eventAggregator.publish('global:message', { body: 'Copied code' });
    });
  }
}
