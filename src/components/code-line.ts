import { LogBuilder } from 'Helpers/LogBuilder';
import { bindable, containerless } from 'aurelia-framework';

const Log = LogBuilder.create('Code line');

@containerless
export class CodeLine {
  @bindable
  icon: string;
  @bindable
  code: string;
  codeTextField: HTMLInputElement;

  copySource() {
    Log.debug('Copying code line to clipboard');
    this.codeTextField.select();
    try {
      document.execCommand('copy');
    } catch (error) {
      Log.warn('Copy failed');
    }
  }
}
