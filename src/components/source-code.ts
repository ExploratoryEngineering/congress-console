import { bindable } from 'aurelia-framework';
import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('Source code');

export class SourceCode {
  sourceTextField: HTMLTextAreaElement;
  @bindable
  headerText: string = 'Your configuration file';
  @bindable
  source: string;

  copySource() {
    Log.debug('Copying source code to clipboard');
    this.sourceTextField.select();
    try {
      document.execCommand('copy');
    } catch (error) {
      Log.warn('Copy failed');
      // Probably no support for execCommand. Fallback.
    }
  }
}
